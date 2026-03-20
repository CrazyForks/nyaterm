---
sidebar_position: 3
---

# 前端开发指南

## 项目结构

前端代码位于 `src/` 目录，使用 React 19 + TypeScript。

## 组件开发

### UI 组件库

项目使用 [shadcn/ui](https://ui.shadcn.com/) 作为基础组件库：

- 组件位于 `src/components/ui/`
- 基于 Radix UI 原语构建
- 使用 TailwindCSS 样式

### 添加新组件

使用 shadcn CLI 添加组件：

```bash
npx shadcn@latest add button
```

### 图标

使用 [Lucide React](https://lucide.dev/) 图标库：

```tsx
import { Terminal } from 'lucide-react';

<Terminal className="w-4 h-4" />
```

## 状态管理

### AppContext

应用核心状态，包括：

- 活动会话列表
- 已保存的连接
- 当前活动标签
- 设置配置

### ThemeContext

主题相关状态：

- 当前主题（深色/浅色）
- 终端主题配色方案
- 字体配置

### TransferContext

文件传输状态：

- 传输队列
- 传输进度
- 完成/错误状态

## 调用 Tauri 命令

通过 `@tauri-apps/api` 调用后端命令：

```typescript
import { invoke } from '@tauri-apps/api/core';

// 创建 SSH 会话
const sessionId = await invoke<string>('create_ssh_session', {
  connectionId: 'uuid-here'
});

// 列出远程目录
const files = await invoke<FileEntry[]>('list_remote_dir', {
  sessionId: 'session-id',
  path: '/home/user'
});
```

## 监听事件

监听后端发送的事件：

```typescript
import { listen } from '@tauri-apps/api/event';

// 监听终端输出
const unlisten = await listen<string>(`terminal-output-${sessionId}`, (event) => {
  terminal.write(event.payload);
});

// 清理监听
unlisten();
```

## 国际化

### 添加翻译

在 `src/i18n/locales/` 下的 JSON 文件中添加键值对。

### 使用翻译

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <span>{t('menu.file')}</span>;
}
```

## 终端集成

终端使用 xterm.js，关键配置：

- **WebGL 插件** — GPU 加速渲染
- **Fit 插件** — 自适应容器大小
- **Search 插件** — 文本搜索
- **Web Links 插件** — URL 点击

```typescript
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';

const terminal = new Terminal({
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 16,
  cursorBlink: true,
});

const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.loadAddon(new WebglAddon());
```
