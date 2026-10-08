本文是 **0x99 Cicadidae** 复古单页博客模板的功能演示与格式指南。

本博客设计遵循 Web 1.0 怀旧风与极简纸张阅读体验，所有文章均在单页中呈现。为了让您在浏览器中使用快捷键（<kbd>Ctrl</kbd> + <kbd>F</kbd> 或 <kbd>Cmd</kbd> + <kbd>F</kbd>）精准搜索，文章的 Tag 标签附带有唯一的格式前缀（例如 `[TAG: RetroWeb]`），以避免与正文中相同的普通词汇混淆。

---

### 一、 文本与基本排版 (Text Formatting)

支持标准的 Markdown 语法，包括 **加粗**、*斜体*、`行内代码` 以及代码块：

```javascript
// 示例代码：复古单页加载
console.log("Welcome to 0x99 Cicadidae Retro Blog!");
```

> **引用示例：** 极简主义不是缺乏东西，而是没有多余的东西。—— Web 1.0 宣言

---

### 二、 图片与点击放大 (Lightbox Image)

点击下方任意图片，即可触发原生的纯 JS 放大预览 modal（支持点击遮罩或按 <kbd>Esc</kbd> 退出）。

<figure>
  <img src="https://picsum.photos/id/1015/800/400" alt="复古风景示例图（点击放大）">
  <figcaption>▲ 示范图片：点击图片体验 Lightbox 放大功能</figcaption>
</figure>

---

### 三、 视频嵌入 (Video Embeds)

模板完美支持 **HTML5 本地视频**、**YouTube 视频** 以及 **Bilibili 视频** 的响应式嵌入。

#### 1. YouTube 视频嵌入模板
<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

#### 2. Bilibili 视频嵌入模板
<div class="video-wrapper">
  <iframe src="//player.bilibili.com/player.html?bvid=BV1GJ411x7us&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
</div>

---

### 四、 内联 SVG 与 交互/循环 CSS-JS 动态 SVG 示例

模板支持在 Markdown/HTML 中直接内联 SVG 元素，并配合内嵌 CSS Keyframe 动画实现循环/交互效果。

#### 示例 1: 循环旋转与呼吸脉冲 SVG 动画 (Looping SVG)

<div class="svg-container">
  <svg width="220" height="220" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <!-- 外圈虚线旋转 -->
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="2" class="anim-dash anim-spin" />

    <!-- 中间六边形/几何图形 -->
    <polygon points="100,40 150,70 150,130 100,160 50,130 50,70" fill="none" stroke="currentColor" stroke-width="2" class="anim-spin" style="animation-direction: reverse; animation-duration: 12s;" />

    <!-- 核心呼吸脉冲圆 -->
    <circle cx="100" cy="100" r="25" fill="var(--accent-color)" class="anim-pulse" />
    <text x="100" y="105" font-family="monospace" font-size="12" fill="#ffffff" text-anchor="middle">RETRO</text>
  </svg>
  <div class="svg-caption">▲ 图：纯 CSS Keyframes 驱动的内联矢量动画</div>
</div>

#### 示例 2: 交互式点击 SVG 动态示例 (Interactive SVG with JS)

点击下方 SVG 图形，可实时改变其颜色与几何角度：

<div class="svg-container">
  <svg id="interactive-svg" width="200" height="150" viewBox="0 0 200 150" style="cursor:pointer;" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" rx="8" fill="var(--code-bg)" stroke="var(--border-color)" stroke-width="2"/>
    <circle id="svg-node" cx="100" cy="75" r="35" fill="#61afef" stroke="var(--border-color)" stroke-width="2" />
    <text id="svg-text" x="100" y="80" font-family="monospace" font-size="12" fill="#ffffff" text-anchor="middle">CLICK ME</text>
  </svg>
  <div class="svg-caption">▲ 图：点击节点体验 JS 动态交互</div>
</div>

<script>
  // 交互 SVG 逻辑演示
  document.getElementById('interactive-svg')?.addEventListener('click', function() {
    const node = document.getElementById('svg-node');
    const text = document.getElementById('svg-text');
    const colors = ['#e06c75', '#98c379', '#e5c07b', '#61afef', '#c678dd'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    if (node) node.setAttribute('fill', randomColor);
    if (text) text.textContent = 'ACTIVE';
  });
</script>

---

### 五、 开箱即用模板复制 (Templates Checklist)

新增文章时，直接复制以下代码块即可：

```html
<!-- 1. 插入图片带 Lightbox -->
<figure>
  <img src="your-image.jpg" alt="描述文字">
  <figcaption>▲ 图注说明</figcaption>
</figure>

<!-- 2. 插入视频 Wrapper -->
<div class="video-wrapper">
  <iframe src="YOUTUBE_OR_BILIBILI_URL" allowfullscreen></iframe>
</div>

<!-- 3. 插入 SVG 动画 Wrapper -->
<div class="svg-container">
  <svg width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" class="anim-spin" />
  </svg>
</div>
```
