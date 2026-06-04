# AirTab 极轻标签页

**纯净、极速、零打扰的新标签页。为 Edge / Chrome 而生。**

[English](#english)

---

## 为什么选择 AirTab？

市面上的新标签页扩展，要么塞满广告和推荐流，要么臃肿卡顿。AirTab 不同——它只做一件事：**让你打开新标签页的那一刻，干净利落，直达目标。**

- **零广告、零推广、零追踪** — 没有推荐流，没有信息流，没有任何打扰
- **极速启动** — 纯原生 JavaScript，无框架依赖，打开即用，不留痕迹
- **极低资源占用** — 不驻留后台，不偷跑内存，老设备也能流畅运行
- **开箱即用** — 内置精美壁纸和常用网站，也支持完全自定义

---

## 功能特性

- **快捷网站网格** — 拖拽排序，自动获取网站图标，首字母兜底显示
- **智能搜索栏** — 支持 Google / Bing / 百度，一键切换
- **背景自定义** — 内置默认壁纸，也支持纯色或本地图片，模糊与遮罩可调
- **时钟与日期** — 可选秒数显示，自动适配浏览器语言环境
- **收藏夹导入** — 一键从浏览器收藏夹添加快捷方式，支持关键词搜索
- **数据备份** — 导出 / 导入全部设置为 JSON 文件，换设备无压力
- **多语言** — 自动检测浏览器语言，支持简体中文和英文

---

## 安装方式

1. 下载或克隆本仓库
2. 打开 `edge://extensions`（或 `chrome://extensions`）
3. 开启 **开发者模式**
4. 点击 **加载已解压的扩展程序**，选择本文件夹

---

## Edge Add-ons 商店

本扩展已适配 Microsoft Edge Add-ons 商店要求：

- Manifest V3 兼容
- 零用户数据收集
- 权限最小化原则

---

## 隐私政策

AirTab 不收集任何用户数据。所有设置通过 `localStorage` 和 `chrome.storage.local` 存储在本地设备上。

无分析服务、无追踪代码、无第三方数据共享。你的浏览器标签页，只属于你自己。

## 权限说明

| 权限 | 用途 |
|---|---|
| `storage` | 在本地持久化保存用户设置 |
| `favicon` | 自动获取网站图标 |
| `bookmarks` | 导入收藏夹（仅在用户主动触发时读取） |

---

## 技术栈

- 纯原生 JavaScript，零框架依赖，无需构建
- Manifest V3
- 极低代码量，极致性能

---

<a id="english"></a>

## English

**A clean, blazing-fast new tab page. Zero ads. Zero distractions. Built for Edge and Chrome.**

### Why AirTab?

Most new tab extensions are bloated with ads, recommendation feeds, or heavy frameworks. AirTab takes a different approach — it does one thing well: **the moment you open a new tab, it's clean, fast, and gets out of your way.**

- **Zero ads, zero promotions, zero tracking** — no feeds, no recommendations, no distractions
- **Instant launch** — pure vanilla JavaScript, no framework overhead
- **Minimal resource footprint** — no background processes, no memory bloat, runs smoothly on older hardware
- **Works out of the box** — built-in HD wallpaper and popular sites, fully customizable

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

AirTab collects **zero user data**. All settings are stored locally via `localStorage` and `chrome.storage.local`.

No analytics, no tracking, no third-party data sharing. Your new tab page is yours alone.

### Permissions Explained

| Permission | Why |
|---|---|
| `storage` | Persist settings locally across browser sessions |
| `favicon` | Auto-fetch website icons for shortcuts |
| `bookmarks` | Import bookmarks (only when user triggers it) |

### Tech Stack

- Pure native JavaScript, zero framework dependencies, no build tools
- Manifest V3
- Minimal codebase, maximum performance

---

## License

MIT

## Author

**Bruce-Poating** — [github.com/Bruce-Poating/AirTab](https://github.com/Bruce-Poating/AirTab)
