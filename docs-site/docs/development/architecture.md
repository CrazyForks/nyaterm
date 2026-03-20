---
sidebar_position: 1
---

# 架构说明

Dragonfly 采用 Tauri 2 架构，前后端分离，通过 IPC 通信。

## 整体架构

```
┌─────────────────────────────────────┐
│           Frontend (React)          │
│  ┌──────┐ ┌──────┐ ┌─────────────┐ │
│  │ 终端  │ │ 文件  │ │   连接管理   │ │
│  │ 面板  │ │ 浏览器│ │             │ │
│  └──┬───┘ └──┬───┘ └──────┬──────┘ │
│     │        │            │         │
│     └────────┴────────────┘         │
│              │ Tauri invoke         │
├──────────────┼──────────────────────┤
│              │ IPC Bridge           │
├──────────────┼──────────────────────┤
│           Backend (Rust)            │
│  ┌──────────┐ ┌──────┐ ┌────────┐  │
│  │ Session  │ │ SSH  │ │ Config │  │
│  │ Manager  │ │ SFTP │ │ Store  │  │
│  └──────────┘ └──────┘ └────────┘  │
└─────────────────────────────────────┘
```

## 前端架构

### 技术栈

- **React 19** — UI 框架
- **TypeScript** — 类型安全
- **Vite** — 构建工具
- **TailwindCSS 4** — 样式框架
- **xterm.js** — 终端模拟器

### 目录结构

```
src/
├── components/          # UI 组件
│   ├── dialogs/         # 对话框组件
│   ├── panels/          # 面板组件（侧边栏、文件浏览器等）
│   ├── layout/          # 布局组件
│   └── ui/              # 基础 UI 组件（shadcn/ui）
├── context/             # React Context
│   ├── AppContext.tsx    # 应用全局状态
│   ├── ThemeContext.tsx  # 主题管理
│   └── TransferContext.tsx # 文件传输状态
├── hooks/               # 自定义 Hooks
├── i18n/                # 国际化
│   └── locales/         # 语言包（en.json, zh-CN.json）
├── lib/                 # 工具库
├── pages/               # 子窗口页面
├── types/               # TypeScript 类型定义
├── App.tsx              # 主应用组件
└── main.tsx             # 入口文件
```

### 状态管理

使用 React Context 管理全局状态：

- **AppContext** — 会话列表、连接配置、活动标签等
- **ThemeContext** — 主题配置和切换
- **TransferContext** — 文件传输队列和进度

## 后端架构

### 模块组织

```
src-tauri/src/
├── commands/            # Tauri 命令处理器
│   ├── session_cmds.rs  # 会话管理命令
│   ├── sftp_cmds.rs     # SFTP 文件操作命令
│   ├── config_cmds.rs   # 配置读写命令
│   ├── settings_cmds.rs # 设置管理命令
│   └── stats.rs         # 系统信息命令
├── config/              # 配置管理
├── translate/           # 翻译服务
├── lib.rs               # 应用入口，Tauri 设置
├── session.rs           # SessionManager 会话管理器
├── ssh.rs               # SSH 客户端实现
├── sftp.rs              # SFTP 文件传输
├── pty.rs               # 本地 PTY 管理
├── crypto.rs            # AES-256-GCM 加密
├── fuzzy.rs             # 命令模糊搜索
├── error.rs             # 错误类型
├── watcher.rs           # 文件监听
└── import.rs            # 会话导入
```

### 核心组件

#### SessionManager

管理所有活动会话（SSH 和本地终端）：

```rust
pub struct SessionManager {
    sessions: Arc<Mutex<HashMap<String, SessionHandle>>>,
    command_history: Arc<Mutex<HashMap<String, Vec<String>>>>,
    history_store: Arc<Mutex<CommandHistoryStore>>,
}
```

- 维护会话生命周期
- 通过 MPSC channel 向会话发送命令（写入、调整大小、关闭）
- 缓冲终端输出直到前端连接

#### SSH 客户端

基于 `russh` 库的异步 SSH 客户端：

- TOFU 主机密钥验证
- 支持密码和密钥认证
- 代理支持（SOCKS5）
- OSC 7 集成获取远程 CWD

#### SFTP 实现

高性能文件传输：

- 在现有 SSH 连接上复用通道
- 管道化并发下载（16 并发，128 KiB 块）
- 实时传输进度事件

### 事件通信

后端通过 Tauri 事件系统向前端发送通知：

| 事件 | 说明 |
|------|------|
| `terminal-output-{id}` | 终端输出数据 |
| `cwd-changed-{id}` | 工作目录变化 |
| `session-closed-{id}` | 会话关闭 |
| `transfer-event` | SFTP 传输进度 |
| `sessions-changed` | 会话列表更新 |
| `connections-changed` | 连接配置变化 |

### 配置文件

所有配置存储在 `~/.dragonfly/` 目录下：

| 文件 | 内容 |
|------|------|
| `sessions.json` | SSH 连接和分组 |
| `keys.json` | SSH 私钥（加密存储） |
| `settings.json` | 应用设置 |
| `quick-command.json` | 快捷命令 |
| `history.json` | 命令历史 |
| `known_hosts` | SSH 主机密钥 |
