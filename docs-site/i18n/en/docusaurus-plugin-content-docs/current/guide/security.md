---
sidebar_position: 7
---

# Security

Dragonfly provides multiple layers of security protection.

## Credential Storage

### System Keychain

Enable **Use OS Keyring** to securely store credentials in the OS native keychain:

- **macOS** — Keychain
- **Windows** — Credential Manager
- **Linux** — Secret Service (GNOME Keyring / KWallet)

### Encrypted Storage

All sensitive data (passwords, private keys, passphrases) is encrypted with **AES-256-GCM** before being stored locally.

## Master Password

Enable **Require Master Password** to encrypt session data with a master password that must be entered on each application startup.

Configure in **Settings → Security → Authentication**.

## Screen Lock

### Manual Lock

Click the **Lock** button in the status bar, or use the keyboard shortcut.

### Auto Lock

When **Screen Lock Protection** is enabled, the app locks automatically:

- On application startup
- After a configurable idle period (set to 0 to disable)

### Unlock Password

An optional unlock password can be set. Without a password, a simple click unlocks.

## SSH Key Management

Manage SSH private keys in **Settings → Security → Key Management**:

- Import private key files
- Set key names and passphrases
- Delete unused keys

Imported keys are encrypted before storage.

## Host Key Policy

Control how unknown SSH host keys are handled:

| Policy | Behavior |
|--------|----------|
| Prompt | Ask on first connection (default) |
| Accept | Automatically accept and record new keys |
| Strict | Reject all unknown host keys |

Known host keys are stored in `~/.dragonfly/known_hosts`.
