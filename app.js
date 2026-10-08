/* ==========================================================================
   Retro Blog Single-Page Application Logic (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  loadPosts();
  initLightbox();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Light / Dark Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeText = document.getElementById('theme-text');
  const html = document.documentElement;

  // Restore saved theme or match system preference
  const savedTheme = localStorage.getItem('blog-theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }

  updateToggleText();

  toggleBtn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('blog-theme', newTheme);
    updateToggleText();
  });

  function updateToggleText() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }
}

/* --------------------------------------------------------------------------
   2. Front Matter Parser
   -------------------------------------------------------------------------- */
function parseFrontMatter(text) {
  const meta = {
    title: '',
    date: '',
    author: '',
    tags: []
  };
  let content = text;

  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  const match = text.match(frontMatterRegex);

  if (match) {
    content = text.slice(match[0].length);
    const yamlLines = match[1].split(/\r?\n/);

    yamlLines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) return;

      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (key === 'tags') {
        if (value.startsWith('[') && value.endsWith(']')) {
          meta.tags = value
            .slice(1, -1)
            .split(',')
            .map(t => t.trim().replace(/^['"]|['"]$/g, ''))
            .filter(Boolean);
        } else if (value) {
          meta.tags = [value];
        }
      } else if (key) {
        meta[key] = value;
      }
    });
  }

  return { meta, content };
}

/* --------------------------------------------------------------------------
   3. Post Manifest & Markdown Loader
   -------------------------------------------------------------------------- */
async function loadPosts() {
  const container = document.getElementById('posts-container');
  try {
    const response = await fetch('posts/posts.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.statusText}`);
    }
    const manifest = await response.json();

    if (!manifest.posts || manifest.posts.length === 0) {
      container.innerHTML = '<div class="loading-indicator">[ No posts found in manifest ]</div>';
      return;
    }

    container.innerHTML = ''; // Clear loading indicator

    const loadedPostsMeta = [];

    // Fetch and render each Markdown post in order
    for (const postItem of manifest.posts) {
      try {
        const filename = typeof postItem === 'string' ? postItem : (postItem.filename || postItem);
        const manifestMeta = typeof postItem === 'object' ? postItem : {};

        const postRes = await fetch(`posts/${filename}`);
        if (!postRes.ok) {
          console.error(`Failed to load ${filename}`);
          continue;
        }
        const rawMd = await postRes.text();
        const { meta: fmMeta, content: mdContent } = parseFrontMatter(rawMd);

        const postMeta = {
          filename,
          id: filename.replace(/\.md$/, ''),
          ...manifestMeta,
          ...fmMeta
        };

        const postElement = renderPost(postMeta, mdContent);
        container.appendChild(postElement);
        executePostScripts(postElement);
        loadedPostsMeta.push(postMeta);
      } catch (err) {
        console.error(`Error loading post:`, err);
      }
    }

    // Render directory / article index list at bottom of page
    renderDirectory(loadedPostsMeta);

    // Attach image lightbox listeners & interactive SVG fallback
    setupImageLightboxListeners();
    setupInteractiveSvgListeners();

  } catch (error) {
    console.error('Error in loadPosts:', error);
    container.innerHTML = `<div class="loading-indicator">[ Error loading posts: ${error.message} ]</div>`;
  }
}

/* --------------------------------------------------------------------------
   4. Render Single Post Element
   -------------------------------------------------------------------------- */
function renderPost(meta, markdown) {
  const article = document.createElement('article');
  article.className = 'post-card';
  article.id = `post-${meta.id || meta.filename.replace('.md', '')}`;

  // Format tags simplified with # prefix: #label
  const tagsHtml = (meta.tags || [])
    .map(tag => `<span class="retro-tag">#${escapeHtml(tag)}</span>`)
    .join(' ');

  // Parse Markdown using marked
  let htmlBody = marked.parse(markdown);

  article.innerHTML = `
    <header class="post-header">
      <h2 class="post-title">${escapeHtml(meta.title)}</h2>
      <div class="post-meta">
        <span class="post-date">📅 ${escapeHtml(meta.date)}</span>
        ${meta.author ? `<span class="post-author">✍️ ${escapeHtml(meta.author)}</span>` : ''}
        <div class="tag-container">${tagsHtml}</div>
      </div>
    </header>
    <div class="post-body">
      ${htmlBody}
    </div>
  `;

  return article;
}

/* --------------------------------------------------------------------------
   5. Script Execution in Dynamic HTML Content
   -------------------------------------------------------------------------- */
function executePostScripts(container) {
  const scripts = container.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    newScript.appendChild(document.createTextNode(oldScript.textContent));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

/* --------------------------------------------------------------------------
   6. Lightbox Modal Functionality
   -------------------------------------------------------------------------- */
let currentScale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

function updateLightboxTransform() {
  const img = document.getElementById('lightbox-img');
  if (!img) return;
  if (currentScale === 1) {
    translateX = 0;
    translateY = 0;
  }
  img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
  if (currentScale > 1) {
    img.style.cursor = isDragging ? 'grabbing' : 'grab';
  } else {
    img.style.cursor = 'zoom-in';
  }
}

function resetLightboxZoom() {
  currentScale = 1;
  translateX = 0;
  translateY = 0;
  isDragging = false;
  updateLightboxTransform();
}

function initLightbox() {
  const modal = document.getElementById('lightbox');
  const closeBtn = document.querySelector('.lightbox-close');
  const img = document.getElementById('lightbox-img');

  if (!modal || !closeBtn || !img) return;

  closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Wheel zoom
  modal.addEventListener('wheel', (e) => {
    if (!modal.classList.contains('active')) return;
    e.preventDefault();

    const delta = e.deltaY;
    const zoomFactor = delta < 0 ? 1.15 : 0.87;
    const newScale = Math.min(Math.max(1, currentScale * zoomFactor), 5);

    if (newScale !== currentScale) {
      currentScale = newScale;
      updateLightboxTransform();
    }
  }, { passive: false });

  // Mouse drag panning
  img.addEventListener('mousedown', (e) => {
    if (currentScale > 1) {
      e.preventDefault();
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      updateLightboxTransform();
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateLightboxTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      updateLightboxTransform();
    }
  });

  // Double-click to toggle zoom between 1x and 2.5x
  img.addEventListener('dblclick', (e) => {
    e.preventDefault();
    if (currentScale > 1) {
      resetLightboxZoom();
    } else {
      currentScale = 2.5;
      translateX = 0;
      translateY = 0;
      updateLightboxTransform();
    }
  });
}

function openLightbox(imgSrc, captionText) {
  const modal = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (!modal || !img) return;

  resetLightboxZoom();
  img.src = imgSrc;
  caption.textContent = captionText || '';
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  const modal = document.getElementById('lightbox');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  resetLightboxZoom();
}

function setupImageLightboxListeners() {
  const images = document.querySelectorAll('.post-body img');
  images.forEach(img => {
    img.addEventListener('click', () => {
      const altText = img.getAttribute('alt') || '';
      openLightbox(img.src, altText);
    });
  });
}

/* --------------------------------------------------------------------------
   7. Interactive SVG Event Handlers
   -------------------------------------------------------------------------- */
function setupInteractiveSvgListeners() {
  const svgElements = document.querySelectorAll('#interactive-svg');
  svgElements.forEach(svg => {
    svg.addEventListener('click', () => {
      const node = svg.querySelector('#svg-node');
      const text = svg.querySelector('#svg-text');
      const colors = ['#e06c75', '#98c379', '#e5c07b', '#61afef', '#c678dd', '#d19a66'];
      const currentColor = node ? node.getAttribute('fill') : '';
      let randomColor = colors[Math.floor(Math.random() * colors.length)];
      while (randomColor === currentColor) {
        randomColor = colors[Math.floor(Math.random() * colors.length)];
      }
      if (node) node.setAttribute('fill', randomColor);
      if (text) text.textContent = 'ACTIVE';
    });
  });
}

/* --------------------------------------------------------------------------
   8. Render Directory / Index List at Page Bottom
   -------------------------------------------------------------------------- */
function renderDirectory(postsMeta) {
  const dirList = document.getElementById('posts-directory-list');
  if (!dirList) return;

  dirList.innerHTML = '';
  postsMeta.forEach((meta, idx) => {
    const postId = `post-${meta.id || meta.filename.replace('.md', '')}`;
    const li = document.createElement('li');
    li.className = 'directory-item';

    const num = String(idx + 1).padStart(2, '0');
    const tagsStr = (meta.tags || []).map(t => `#${t}`).join(' ');

    li.innerHTML = `
      <span class="dir-num">[${num}]</span>
      <a href="#${postId}" class="dir-link">${escapeHtml(meta.title)}</a>
      <span class="dir-meta">(${escapeHtml(meta.date)}) ${escapeHtml(tagsStr)}</span>
    `;
    dirList.appendChild(li);
  });
}

/* Helper Utility */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
