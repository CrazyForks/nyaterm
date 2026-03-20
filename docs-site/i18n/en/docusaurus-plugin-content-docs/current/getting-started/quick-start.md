---
sidebar_position: 2
---

# Quick Start

This guide will walk you through creating and using your first SSH connection.

## Create an SSH Connection

1. Click **New Connection** in the left sidebar, or use **File → New SSH Connection**
2. Fill in the dialog:
   - **Connection Name** — A friendly display name
   - **Host** — Server IP address or domain name
   - **Port** — SSH port (default 22)
   - **Username** — Login username
   - **Authentication** — Password or private key
3. Click **Save**

## Connect to a Server

Double-click a connection in the sidebar, or right-click and select **Connect** to start an SSH session.

A new terminal tab will appear in the center area upon successful connection.

## Basic Operations

### Multi-Tab Management

- Open multiple SSH connections simultaneously, each in its own tab
- Use `Ctrl+Tab` to switch between tabs
- Use `Ctrl+W` to close the current tab

### File Browsing

After connecting, the right-side file explorer automatically shows the remote filesystem:

- Browse directory structure
- Upload/download files
- Right-click for file operations (rename, delete, move, etc.)

### Command History

Dragonfly automatically records your commands, searchable via fuzzy matching.

## Create a Local Terminal

You can also create local shell sessions via **Terminal → New Local Terminal**.

## Next Steps

- Learn more about [SSH Connection Management](../guide/ssh-connection)
- Explore [SFTP File Transfer](../guide/file-transfer)
- Set up [Quick Commands](../guide/quick-commands) for productivity
