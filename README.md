# FlashTab — 秒开页

**纯净、极速、零打扰的新标签页。为 Edge / Chrome 而生。**

[English](#english)

---

## 为什么选择秒开页？

市面上的新标签页扩展，要么塞满广告和推荐流，要么臃肿卡顿。秒开页不同——它只做一件事：**让你打开新标签页的那一刻，干净利落，直达目标。**

- **零广告、零推广、零追踪** — 没有推荐流，没有信息流，没有任何打扰
- **极速启动** — 纯原生 JavaScript，无框架依赖，打开即用，不留痕迹
- **极低资源占用** — 总代码量约 850 行，不驻留后台，不偷跑内存
- **默认精美壁纸** — 开箱即用，也支持自定义背景图片

## 功能特性

- **快捷网站网格** — 拖拽排序，自动获取网站图标，首字母兜底显示
- **智能搜索栏** — 支持 Google / Bing / 百度，一键切换
- **背景自定义** — 内置默认壁纸，也支持纯色或本地图片，模糊与遮罩可调
- **时钟与日期** — 可选秒数显示，自动适配浏览器语言环境
- **收藏夹导入** — 一键从浏览器收藏夹添加快捷方式，支持关键词搜索
- **数据备份** — 导出 / 导入全部设置为 JSON 文件，换设备无压力
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

无分析服务、无追踪代码、无第三方数据共享。你的浏览器标签页，只属于你自己。

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

**A clean, blazing-fast new tab page. Zero ads. Zero distractions. Built for Edge and Chrome.**

### Why FlashTab?

Most new tab extensions are bloated with ads, recommendation feeds, or heavy frameworks. FlashTab takes a different approach — it does one thing well: **the moment you open a new tab, it's clean, fast, and gets out of your way.**

- **Zero ads, zero promotions, zero tracking** — no feeds, no recommendations, no distractions
- **Instant launch** — pure vanilla JavaScript, no framework overhead
- **Minimal resource footprint** — ~850 lines of code, no background processes, no memory bloat
- **Beautiful default wallpaper** — works out of the box, with custom background support

### Features

- **Quick Site Grid** — Drag-and-drop shortcuts with auto-fetched favicons
- **Smart Search Bar** — Google, Bing, or Baidu; one-click switching
- **Background Customization** — Built-in default wallpaper, or use solid color / local image with blur and overlay controls
- **Clock & Date** — Optional seconds display, auto-adapts to browser locale
- **Bookmark Import** — One-click import from browser bookmarks with keyword search
- **Data Backup** — Export/import all settings as JSON, seamless device migration
- **Multi-language** — Auto-detects browser language, supports English and Simplified Chinese

### Installation

1. Download or clone this repository
2. Open `edge://extensions` (or `chrome://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select the extension folder

### Edge Add-ons Store

This extension meets Microsoft Edge Add-ons store requirements:

- Manifest V3 compatible
- Zero user data collection
- Minimal permissions principle

### Privacy

FlashTab collects **zero user data**. All settings are stored locally via `localStorage` and `chrome.storage.local`.

- `storage` permission: persist settings across sessions
- `favicon` permission: auto-fetch website icons
- `bookmarks` permission: only read when user actively clicks "Import from Bookmarks"

No analytics, no tracking, no third-party data sharing. Your new tab page is yours alone.

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
