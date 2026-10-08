# 0x99 Cicadidae - Retro Blog Template for GitHub Pages

一个简洁、极其克制且纯粹的复古博客网页模板。基于纯静态 HTML/CSS/Vanilla JS 构建，专为 **GitHub Pages** 设计。融合了 **Web 1.0 怀旧风** 与 **极简纸张阅读体验**。

![License](https://img.shields.io/badge/license-GPLv3-blue.svg)
![Architecture](https://img.shields.io/badge/architecture-Single--Page%20Vanilla%20JS-success.svg)

---

## ✨ 核心特性 (Features)

- 📜 **单页完全加载 (Single-Page Journal)**: 所有文章呈现在同一个页面中，不分多页，响应迅速。
- 🔍 **依托原生浏览器搜索 (Native Browser Search)**: 充分利用浏览器的 <kbd>Ctrl</kbd> + <kbd>F</kbd>（或 <kbd>Cmd</kbd> + <kbd>F</kbd>）全文检索。标签采用简洁的 `#tag_name` 格式，方便直观检索。
- 🎨 **极简克制与复古美学 (Retro & Paper Aesthetic)**: 纯手写 CSS，浅色模式采用暖白/米黄纸张阅读风格，深色模式采用暗色 CRT 终端风格。
- 🌗 **深色 / 浅色模式切换**: 一键切换主题，自动记忆用户选择。
- 🖼️ **图片点击放大 (Lightbox)**: 点击文章内任何图片，触发原生轻量级图片放大模态框。
- 🎬 **富媒体支持**: 响应式视频容器（支持 HTML5 `<video>`、YouTube 与 Bilibili 嵌入）。
- 🌀 **SVG 矢量动画支持**: 内联 SVG 支持，预设 CSS 循环旋转、呼吸脉冲、虚线流动动画以及 JS 交互 SVG 节点。
- 📝 **Markdown 格式撰写**: 文章使用 Markdown 编写，通过清单文件 `posts/posts.json` 自动解析渲染。

---

## 📁 目录结构 (Directory Structure)

```
.
├── index.html        # 主页面结构
├── style.css         # 完全手写克制的 CSS 样式（含浅色/深色主题与动画）
├── app.js            # 核心脚本：主题切换、Markdown 加载、Tags 渲染、Lightbox 模态框
├── posts/
│   ├── posts.json    # 文章索引清单 (Manifest)
│   ├── demo.md       # 富媒体与 SVG 动态示例文章
│   └── philosophy.md # 极简单页设计哲学文章
├── LICENSE           # 开源协议 (GPL-3.0)
└── README.md         # 本说明文档
```

---

## 🚀 快速开始与使用指南 (How to Use)

### 1. 部署到 GitHub Pages

1. 将本仓库 Fork 或 Push 到你的 GitHub 账户（例如仓库名为 `username.github.io`）。
2. 在 GitHub 仓库设置中，进入 **Settings** -> **Pages**。
3. 在 **Source** 下选择 `Deploy from a branch`，Branch 选择 `main` (或 `master`) / `/ (root)`。
4. 保存后即可通过 `https://<your-username>.github.io` 访问你的复古博客。

---

### 2. 发布新文章

只需两步即可发布新文章：

#### 步骤一：在 `posts/` 目录下创建 Markdown 文件 (如 `my-new-post.md`)

可以使用 Markdown 标准语法，也可以插入富媒体元素：

```markdown
这是我的第一篇复古博客文章。

### 插入图片 (点击可放大)
<figure>
  <img src="https://example.com/image.jpg" alt="示例图片">
  <figcaption>▲ 示例图片说明</figcaption>
</figure>

### 插入 YouTube/Bilibili 视频
<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>
</div>

### 插入 SVG 动画
<div class="svg-container">
  <svg width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" class="anim-spin" />
  </svg>
</div>
```

#### 步骤二：在 `posts/posts.json` 中添加文章配置

修改 `posts/posts.json` 文件，添加你的新文章条目：

```json
{
  "posts": [
    {
      "id": "my-new-post",
      "filename": "my-new-post.md",
      "title": "我的第一篇文章标题",
      "date": "2025-05-20",
      "author": "0x99 Cicadidae",
      "tags": ["Life", "RetroWeb", "Notes"]
    }
  ]
}
```

---

## 🏷️ 浏览器搜索与 Tag 说明

在搜索文章或特定标签时：
- 按下 <kbd>Ctrl</kbd> + <kbd>F</kbd> 输入 `#RetroWeb` 即可快速精确定位所有包含该标签的文章。
- 直接输入任意文本即可进行全局正文查找。

---

## 📄 开源许可 (License)

本项目遵循 [GNU General Public License v3.0](LICENSE)。
