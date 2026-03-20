---
sidebar_position: 4
---

# Backend Development

## Project Structure

Backend code is in `src-tauri/src/`, written in Rust.

## Adding Tauri Commands

### 1. Define the Command

Add commands in `src-tauri/src/commands/`:

```rust
use tauri::State;
use crate::session::SessionManager;

#[tauri::command]
pub async fn my_command(
    session_manager: State<'_, SessionManager>,
    param: String,
) -> Result<String, String> {
    Ok("result".to_string())
}
```

### 2. Register the Command

In `src-tauri/src/lib.rs`, add to `invoke_handler`:

```rust
.invoke_handler(tauri::generate_handler![
    // ...existing commands
    commands::my_command,
])
```

### 3. Call from Frontend

```typescript
const result = await invoke<string>('my_command', { param: 'value' });
```

## SSH Module

### Connection Flow

1. Load connection info from config
2. Decrypt password/private key
3. Establish TCP connection (optional proxy)
4. TOFU host key verification
5. Authenticate (password/key)
6. Open PTY channel
7. Inject OSC 7 script (CWD tracking)
8. Start async I/O loop

### I/O Loop

Each session maintains an async task:

```rust
tokio::spawn(async move {
    loop {
        tokio::select! {
            cmd = cmd_rx.recv() => {
                // Handle: Write, Resize, Close, Attach
            }
            msg = channel.wait() => {
                // Handle: Data, ExtendedData, Eof
            }
        }
    }
});
```

## SFTP Module

### Transfer Optimization

Downloads use pipelined concurrent reads:
- 16 concurrent file handles
- 128 KiB per chunk
- ~1 MiB in-flight buffer
- Sliding window for known-size files
- Sequential reads for unknown-size files (e.g., `/proc`)

### Directory Operations

Recursive deletion uses a fault-tolerant strategy — partial failures don't affect other deletions.

## Encryption Module

AES-256-GCM for sensitive data:

```rust
let encrypted = encrypt_string("plaintext", &key)?;
let decrypted = decrypt_string(&encrypted, &key)?;
```

Key sources: OS Keyring or master password derivation.

## Configuration Management

JSON-based configs in `~/.dragonfly/`:

```rust
let config = SessionConfig::load()?;
config.save()?;
```

Config changes emit `connections-changed` events to notify the frontend.

## Logging

Uses the `tracing` crate:

```rust
use tracing::{info, warn, error, debug};

info!("Session created: {}", session_id);
warn!("Connection timeout for: {}", host);
error!("SSH error: {:?}", err);
```

Log files are in the app log directory with daily rotation and 7-day retention.
