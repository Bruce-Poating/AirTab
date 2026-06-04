# FlashTab — 秒开页

**极简极速的新标签页扩展，为 Edge / Chrome 打造。**

[English](#english)

---

## 功能特性

- **快捷网站网格** — 拖拽排序，自动获取网站图标，首字母兜底
- **搜索栏** — 支持 Google、Bing、百度，设置中一键切换
- **背景自定义** — 纯色或本地图片，支持模糊和遮罩透明度调节
- **时钟显示** — 可选秒数，自动适配浏览器语言环境
- **收藏夹导入** — 一键从浏览器收藏夹添加快捷方式，支持关键词搜索
- **数据备份** — 导出/导入全部设置为 JSON 文件
- **完全本地** — 所有数据存储在设备本地，零追踪、零上传
- **多语言** — 自动检测浏览器语言，支持简体中文和英文

## 安装方式

1. 下载或克隆本仓库
2. 打开 `edge://extensions`（或 `chrome://extensions`）
3. 开启 **开发者模式**
4. 点击 **加载已解压的扩展程序**，选择本文件夹

## Edge Add-ons 商店发布

本扩展已适配 Microsoft Edge Add-ons 商店要求：
- Manifest V3 兼容
- 零用户数据收集
- 权限最小化原则

## 隐私政策

FlashTab（秒开页）不收集任何用户数据。所有设置通过 `localStorage` 和 `chrome.storage.local` 存储在本地设备上。

- `storage` 权限：持久化保存用户设置，防止清除缓存时丢失
- `favicon` 权限：自动获取网站图标
- `bookmarks` 权限：仅在用户主动点击"从收藏夹导入"时读取，不会后台自动访问

无分析服务、无追踪代码、无第三方数据共享。

默认包含部分推广链接（如淘宝），用户可自由编辑或删除。

## 权限说明

| 权限 | 用途 |
|---|---|
| `storage` | 在本地持久化保存用户设置 |
| `favicon` | 自动获取网站图标 |
| `bookmarks` | 导入收藏夹（仅在用户主动触发时读取） |

## 技术栈

- 纯 JavaScript，无框架依赖，无需构建
- Manifest V3
- 总代码量约 850 行

---

<a id="english"></a>

## English

**A blazing fast, minimalist new tab extension for Edge and Chrome.**

### Features

- **Quick Site Grid** — Drag-and-drop shortcut icons with auto-fetched favicons
- **Search Bar** — Google, Bing, or Baidu; switchable from settings
- **Background Customization** — Solid color or local image, with blur and overlay controls
- **Clock Display** — Optional seconds, auto-adapts to browser locale
- **Bookmark Import** — One-click import from browser bookmarks with keyword search
- **Data Backup** — Export/import all settings as JSON file
- **Fully Local** — All data stored on device, zero tracking, zero uploads
- **Multi-language** — Auto-detects browser language, supports English and Simplified Chinese

### Installation

1. Download or clone this repository
2. Open `edge://extensions` (or `chrome://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select the extension folder

### Privacy

FlashTab collects **zero user data**. All settings are stored locally via `localStorage` and `chrome.storage.local`.

- `storage` permission: persist settings across sessions
- `favicon` permission: auto-fetch website icons
- `bookmarks` permission: only read when user actively clicks "Import from Bookmarks"

No analytics, no tracking, no third-party data sharing.

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
- ~850 lines of code total

---

## License

MIT

## Author

**Bruce-Poating** — [github.com/Bruce-Poating/FlashTab](https://github.com/Bruce-Poating/FlashTab)
