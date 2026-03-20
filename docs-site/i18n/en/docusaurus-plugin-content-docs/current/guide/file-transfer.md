---
sidebar_position: 2
---

# SFTP File Transfer

Dragonfly includes a full-featured SFTP file manager built right into the interface.

## File Explorer

After connecting to an SSH session, the right sidebar displays the remote file explorer:

- Automatically navigates to the user's home directory
- Click folders to enter, click **Go Up** to navigate back
- Click the path bar to type a path directly
- Supports auto-sync with terminal working directory

### File Operations

Right-click files or folders for these operations:

| Operation | Description |
|-----------|-------------|
| Open | Open file in default editor |
| Download | Download file to local machine |
| Rename | Rename file or folder |
| Move | Move file to specified path |
| Delete | Delete file or folder (recursive) |
| Properties | View detailed file information |
| Copy Path | Copy the full file path |

### Create Files and Folders

From the toolbar:

- New File
- New Folder
- New Symlink

## File Upload

Click the **Upload** button in the toolbar to upload local files to the current directory.

## File Download

Select a file and click **Download** in the toolbar, or right-click and select **Download**.

Dragonfly uses pipelined transfer technology with multiple concurrent data chunk reads for significantly faster large file transfers.

## Transfer Progress

In the **File Transfer** panel on the right sidebar, view real-time progress of all transfer tasks:

- Transferring files with progress
- Completed transfers
- Transfer errors

Clear completed transfers with one click.

## Path Sync

The file explorer supports syncing with the terminal path:

- **Manual Sync** — Click the sync button to navigate to the terminal's current directory
- **Auto Sync** — When enabled, the file explorer automatically follows the terminal's working directory

## File Properties

Right-click a file and select **Properties** to view:

- File size
- Modified and access times
- Owner and group
- Permissions (user/group/other, octal notation)
- UID and GID
