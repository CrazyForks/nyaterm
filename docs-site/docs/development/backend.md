---
sidebar_position: 4
---

# 后端开发指南

## 项目结构

后端代码位于 `src-tauri/src/`，使用 Rust 编写。

## 添加 Tauri 命令

### 1. 定义命令函数

在 `src-tauri/src/commands/` 中添加命令：

```rust
use tauri::State;
use crate::session::SessionManager;

#[tauri::command]
pub async fn my_command(
    session_manager: State<'_, SessionManager>,
    param: String,
) -> Result<String, String> {
    // 实现逻辑
    Ok("result".to_string())
}
```

### 2. 注册命令

在 `src-tauri/src/lib.rs` 的 `invoke_handler` 中注册：

```rust
.invoke_handler(tauri::generate_handler![
    // ...existing commands
    commands::my_command,
])
```

### 3. 前端调用

```typescript
const result = await invoke<string>('my_command', { param: 'value' });
```

## SSH 模块

### 连接流程

1. 从配置加载连接信息
2. 解密密码/私钥
3. 建立 TCP 连接（可选代理）
4. TOFU 主机密钥验证
5. 认证（密码/密钥）
6. 打开 PTY 通道
7. 注入 OSC 7 脚本（CWD 追踪）
8. 启动异步 I/O 循环

### I/O 循环

每个会话维护一个异步任务：

```rust
tokio::spawn(async move {
    loop {
        tokio::select! {
            cmd = cmd_rx.recv() => {
                // 处理前端命令：Write, Resize, Close, Attach
            }
            msg = channel.wait() => {
                // 处理 SSH 数据：Data, ExtendedData, Eof
            }
        }
    }
});
```

## SFTP 模块

### 传输优化

下载使用管道化并发读取：

- 16 个并发文件句柄
- 每块 128 KiB
- ~1 MiB 飞行中缓冲区
- 已知大小文件使用滑动窗口
- 未知大小文件（如 `/proc`）使用顺序读取

### 目录操作

递归删除时采用容错策略，部分失败不影响其他文件的删除。

## 加密模块

使用 AES-256-GCM 加密敏感数据：

```rust
// 加密
let encrypted = encrypt_string("plaintext", &key)?;

// 解密
let decrypted = decrypt_string(&encrypted, &key)?;
```

密钥来源：
- 使用系统密钥链时，从 OS Keyring 获取
- 使用主密码时，从密码派生

## 配置管理

配置文件使用 JSON 格式，位于 `~/.dragonfly/`：

```rust
// 读取配置
let config = SessionConfig::load()?;

// 保存配置
config.save()?;
```

配置文件变更会触发 `connections-changed` 事件通知前端。

## 日志

使用 `tracing` 库记录日志：

```rust
use tracing::{info, warn, error, debug};

info!("Session created: {}", session_id);
warn!("Connection timeout for: {}", host);
error!("SSH error: {:?}", err);
```

日志文件位于应用日志目录，每日轮转，保留 7 天。
