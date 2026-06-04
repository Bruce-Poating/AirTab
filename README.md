# FlashTab

**[English](#english)** | **[中文](#中文)**

A lightweight, privacy-friendly custom new tab page for Chrome and Edge.

---

## English

### Features

- **Quick Site Grid** — Drag-and-drop customizable shortcut icons with auto-fetched favicons
- **Search Bar** — Google, Bing, or Baidu; switchable from settings
- **Background Customization** — Solid color or image, with blur and overlay controls
- **Clock Display** — Optional seconds, auto-adapts to browser locale and language
- **Bookmark Import** — One-click import from browser bookmarks with search filter
- **Data Backup** — Export/import all settings as JSON file
- **Fully Local** — No data ever leaves your device, zero tracking
- **Multi-language** — Supports English and Simplified Chinese, auto-detects browser language

### Installation

1. Download or clone this repository
2. Open `edge://extensions` (or `chrome://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select the extension folder

### Privacy

FlashTab collects **zero data**. All settings are stored locally via `localStorage` and `chrome.storage.local`. The `bookmarks` permission is only used when you actively click "Import from Bookmarks". No analytics, no tracking, no third-party services.

Promotional links (e.g., Taobao) appear as default shortcuts and can be freely edited or deleted.

### Permissions Explained

| Permission | Why |
|---|---|
| `storage` | Persist settings locally across browser sessions |
| `favicon` | Auto-fetch website icons for shortcuts |
| `bookmarks` | Import bookmarks (only when user triggers it) |

### Tech Stack

- Pure JavaScript, no frameworks, no build tools
- Manifest V3
- ~800 lines of code total

---

## 中文

### 功能特性

- **快捷网站网格** — 可拖拽排序，自动获取网站图标
- **搜索栏** — 支持 Google、Bing、百度，设置中一键切换
- **背景自定义** — 纯色或图片，支持模糊和遮罩调节
- **时钟显示** — 可选秒数显示，自动适配浏览器语言环境
- **收藏夹导入** — 一键从浏览器收藏夹添加快捷方式，支持搜索筛选
- **数据备份** — 导出/导入全部设置为 JSON 文件
- **完全本地** — 数据绝不会离开您的设备，零追踪
- **多语言** — 支持英文和简体中文，自动检测浏览器语言

### 安装方式

1. 下载或克隆本仓库
2. 打开 `edge://extensions`（或 `chrome://extensions`）
3. 开启 **开发者模式**
4. 点击 **加载已解压的扩展程序**，选择本文件夹

### 隐私政策

FlashTab 不收集任何数据。所有设置通过 `localStorage` 和 `chrome.storage.local` 存储在本地。`bookmarks` 权限仅在您主动点击"从收藏夹导入"时使用。无分析、无追踪、无第三方服务。

默认包含部分推广链接（如淘宝），可自由编辑或删除。

### 权限说明

| 权限 | 用途 |
|---|---|
| `storage` | 在本地持久化保存用户设置 |
| `favicon` | 自动获取网站图标 |
| `bookmarks` | 导入收藏夹（仅在用户主动触发时读取） |

### 技术栈

- 纯 JavaScript，无框架，无构建工具
- Manifest V3
- 总代码量约 800 行

---

## License

MIT

## Author

**Bruce-Poating** — [github.com/Bruce-Poating/FlashTab](https://github.com/Bruce-Poating/FlashTab)
