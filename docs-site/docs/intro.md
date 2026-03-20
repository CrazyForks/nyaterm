---
sidebar_position: 1
slug: /
---

# 项目介绍

**Dragonfly** 是一个现代、高性能的 SSH 客户端，基于 [Tauri](https://tauri.app/) 和 [React](https://react.dev/) 构建。它将精致的用户界面与强大的 Rust 后端相结合，为开发者和运维人员提供卓越的远程服务器管理体验。

## 核心特性

- **安全高效的 SSH 连接** — 基于 Rust `russh` 库，提供原生级性能
- **多标签界面** — 同时管理多个 SSH 和本地终端会话
- **会话管理** — 保存、组织和快速连接常用服务器
- **集成文件浏览器** — 通过 SFTP 直接在侧边栏浏览和管理远程文件
- **命令历史** — 自动记录并支持模糊搜索的命令历史
- **快捷命令** — 一键执行常用命令，支持变量替换
- **可定制界面** — 可调整面板大小，支持深色/浅色主题
- **跨平台** — 支持 Windows、macOS 和 Linux

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19, TypeScript, Vite, TailwindCSS 4 |
| 后端 | Tauri 2, Rust |
| 终端 | xterm.js (WebGL 加速) |
| SSH | russh (纯 Rust SSH 实现) |
| 文件传输 | russh-sftp (管道化传输) |

## 为什么选择 Dragonfly？

1. **原生性能** — Rust 后端确保 SSH 连接和文件传输的高性能
2. **安全至上** — AES-256-GCM 加密存储凭据，支持系统密钥链
3. **现代 UI** — 基于 React 和 TailwindCSS 的精致界面
4. **轻量级** — 基于 Tauri，安装包体积远小于 Electron 应用
5. **开源免费** — MIT 许可证，完全开源
