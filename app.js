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
    html.setAttribute('data-theme', darkThemeName());
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

  function darkThemeName() {
    return 'dark';
  }
}

/* --------------------------------------------------------------------------
   2. Post Manifest & Markdown Loader
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

    // Fetch and render each Markdown post in order
    for (const postMeta of manifest.posts) {
      try {
        const postRes = await fetch(`posts/${postMeta.filename}`);
        if (!postRes.ok) {
          console.error(`Failed to load ${postMeta.filename}`);
          continue;
        }
        const mdContent = await postRes.text();
        const postElement = renderPost(postMeta, mdContent);
        container.appendChild(postElement);
      } catch (err) {
        console.error(`Error loading post ${postMeta.filename}:`, err);
      }
    }

    // Attach image lightbox listeners to newly rendered images
    setupImageLightboxListeners();

  } catch (error) {
    console.error('Error in loadPosts:', error);
    container.innerHTML = `<div class="loading-indicator">[ Error loading posts: ${error.message} ]</div>`;
  }
}

/* --------------------------------------------------------------------------
   3. Render Single Post Element
   -------------------------------------------------------------------------- */
function renderPost(meta, markdown) {
  const article = document.createElement('article');
  article.className = 'post-card';
  article.id = `post-${meta.id || meta.filename.replace('.md', '')}`;

  // Format tags with distinctive prefix/suffix for browser search distinction: [TAG: label]
  const tagsHtml = (meta.tags || [])
    .map(tag => `<span class="retro-tag">[TAG: ${escapeHtml(tag)}]</span>`)
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
   4. Lightbox Modal Functionality
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightbox');
  const closeBtn = document.querySelector('.lightbox-close');

  if (!modal || !closeBtn) return;

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
}

function openLightbox(imgSrc, captionText) {
  const modal = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (!modal || !img) return;

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
