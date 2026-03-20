---
sidebar_position: 1
---

# SSH Connection Management

## Connection Configuration

### Basic Information

| Field | Description | Required |
|-------|-------------|----------|
| Connection Name | Display name for identification | No |
| Icon | Custom icon | No |
| Group | Connection group | No |
| Host | Server IP or domain | Yes |
| Port | SSH port (default 22) | No |
| Username | Login username | Yes |
| Authentication | Password or private key | Yes |
| Description | Notes about the connection | No |

### Authentication Methods

#### Password Authentication

Enter the server password directly. Passwords are encrypted with AES-256-GCM before storage.

#### Key Authentication

Select an imported SSH private key. Supports RSA, Ed25519, and other common key formats.

Manage keys in **Settings → Security → Key Management**.

## Connection Groups

Organize connections with folders:

- Right-click the sidebar and select **New Folder**
- Support nested folders
- Drag connections into folders
- Right-click folders to rename or delete

## Sorting

Three sorting modes:

- **Custom Order** — Manual drag-and-drop
- **Name A → Z** — Ascending alphabetical
- **Name Z → A** — Descending alphabetical

## Import Sessions

Import sessions from other SSH clients:

1. Right-click the sidebar and select **Import Sessions**
2. Select the source application (currently supports WindTerm)
3. Choose the session configuration file
4. Confirm import

## Host Key Verification

Dragonfly uses TOFU (Trust On First Use) for host key management:

- **Prompt** — Ask on first connection (default)
- **Accept** — Automatically accept new host keys
- **Strict** — Reject all unknown host keys

Configure in **Settings → Security → Connection Security**.

## Proxy Support

Configure proxy in **Settings → Proxy**:

- SOCKS5 protocol support
- Configure proxy host and port
- Enable/disable proxy
