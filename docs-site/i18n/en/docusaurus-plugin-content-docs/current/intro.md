---
sidebar_position: 1
slug: /
---

# Introduction

**Dragonfly** is a modern, high-performance SSH client built with [Tauri](https://tauri.app/) and [React](https://react.dev/). It combines a polished user interface with a powerful Rust backend, providing developers and system administrators with an excellent remote server management experience.

## Key Features

- **Secure & Fast SSH** — Powered by Rust's `russh` library for native-level performance
- **Multi-Tab Interface** — Manage multiple SSH and local terminal sessions simultaneously
- **Session Management** — Save, organize, and quickly connect to frequently used servers
- **Integrated File Explorer** — Browse and manage remote files via SFTP directly from the sidebar
- **Command History** — Automatically recorded with fuzzy search support
- **Quick Commands** — One-click execution of frequent commands with variable substitution
- **Customizable UI** — Resizable panels with dark/light theme support
- **Cross-Platform** — Windows, macOS, and Linux

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, TailwindCSS 4 |
| Backend | Tauri 2, Rust |
| Terminal | xterm.js (WebGL accelerated) |
| SSH | russh (pure Rust SSH implementation) |
| File Transfer | russh-sftp (pipelined transfers) |

## Why Dragonfly?

1. **Native Performance** — Rust backend ensures high-performance SSH and file transfers
2. **Security First** — AES-256-GCM encrypted credential storage with system keychain support
3. **Modern UI** — Polished interface built with React and TailwindCSS
4. **Lightweight** — Tauri-based, much smaller than Electron apps
5. **Open Source** — MIT licensed, fully open source
