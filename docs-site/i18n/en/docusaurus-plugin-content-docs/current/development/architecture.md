---
sidebar_position: 1
---

# Architecture

Dragonfly uses a Tauri 2 architecture with separated frontend and backend communicating via IPC.

## Overall Architecture

```
┌─────────────────────────────────────┐
│           Frontend (React)          │
│  ┌──────┐ ┌──────┐ ┌─────────────┐ │
│  │ Term │ │ File │ │ Connection  │ │
│  │ Panel│ │ Expl │ │  Manager    │ │
│  └──┬───┘ └──┬───┘ └──────┬──────┘ │
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

## Frontend Architecture

### Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool
- **TailwindCSS 4** — Styling
- **xterm.js** — Terminal emulator

### Directory Structure

```
src/
├── components/          # UI components
│   ├── dialogs/         # Dialog components
│   ├── panels/          # Panel components (sidebars, file explorer)
│   ├── layout/          # Layout components
│   └── ui/              # Base UI components (shadcn/ui)
├── context/             # React Context providers
│   ├── AppContext.tsx    # Global application state
│   ├── ThemeContext.tsx  # Theme management
│   └── TransferContext.tsx # File transfer state
├── hooks/               # Custom Hooks
├── i18n/                # Internationalization
├── lib/                 # Utilities
├── pages/               # Child window pages
├── types/               # TypeScript type definitions
├── App.tsx              # Main application component
└── main.tsx             # Entry point
```

### State Management

React Context for global state:

- **AppContext** — Session list, connection configs, active tab
- **ThemeContext** — Theme configuration and switching
- **TransferContext** — File transfer queue and progress

## Backend Architecture

### Module Organization

```
src-tauri/src/
├── commands/            # Tauri command handlers
│   ├── session_cmds.rs  # Session management
│   ├── sftp_cmds.rs     # SFTP file operations
│   ├── config_cmds.rs   # Configuration read/write
│   ├── settings_cmds.rs # Settings management
│   └── stats.rs         # System info
├── config/              # Configuration management
├── translate/           # Translation services
├── lib.rs               # App entry, Tauri setup
├── session.rs           # SessionManager
├── ssh.rs               # SSH client
├── sftp.rs              # SFTP file transfer
├── pty.rs               # Local PTY management
├── crypto.rs            # AES-256-GCM encryption
├── fuzzy.rs             # Command fuzzy search
├── error.rs             # Error types
├── watcher.rs           # File watching
└── import.rs            # Session import
```

### Core Components

#### SessionManager

Manages all active sessions (SSH and local terminals) with a shared HashMap, MPSC channels for commands, and buffered output for late-joining frontends.

#### SSH Client

Async SSH client based on `russh`:
- TOFU host key verification
- Password and key authentication
- Proxy support (SOCKS5)
- OSC 7 integration for remote CWD tracking

#### SFTP Implementation

High-performance file transfers:
- Channel multiplexing on existing SSH connections
- Pipelined concurrent downloads (16 concurrent, 128 KiB chunks)
- Real-time transfer progress events

### Event Communication

Backend emits events to frontend via Tauri:

| Event | Description |
|-------|-------------|
| `terminal-output-{id}` | Terminal output data |
| `cwd-changed-{id}` | Working directory changed |
| `session-closed-{id}` | Session closed |
| `transfer-event` | SFTP transfer progress |
| `sessions-changed` | Session list updated |
| `connections-changed` | Connection config changed |

### Configuration Files

All configs stored in `~/.dragonfly/`:

| File | Content |
|------|---------|
| `sessions.json` | SSH connections and groups |
| `keys.json` | SSH private keys (encrypted) |
| `settings.json` | Application settings |
| `quick-command.json` | Quick commands |
| `history.json` | Command history |
| `known_hosts` | SSH host keys |
