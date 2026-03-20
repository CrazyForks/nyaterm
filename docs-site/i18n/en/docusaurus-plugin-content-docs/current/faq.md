---
sidebar_position: 100
---

# FAQ

## Connection Issues

### SSH connection times out?

1. Verify the server address and port
2. Confirm the SSH service is running on the server
3. Check firewall rules for the SSH port
4. If using a proxy, verify proxy configuration
5. Try increasing Keep-Alive interval (**Settings → Terminal → Keep-Alive Interval**)

### Terminal unresponsive after connecting?

- Try pressing `Enter`
- Check if authentication succeeded
- View application logs (**Help → View Logs**)

### How to use private key authentication?

1. Go to **Settings → Security → Key Management**
2. Click **Add Key** and import your private key file
3. When creating a connection, select **Private Key** authentication and choose the key

## File Transfer

### Slow upload/download speeds?

Dragonfly uses pipelined transfers for optimized large file speeds. Slow speeds may indicate network bandwidth limitations.

### Cannot delete a file?

Check if the current user has delete permissions. View permissions in file properties.

## Interface Issues

### Fonts display incorrectly?

1. Go to **Settings → Appearance → Font Family**
2. Confirm the primary font is installed
3. Add fallback fonts

### Terminal rendering is laggy?

In **Settings → Terminal**:
- Toggle **Hardware Acceleration** (requires app restart)
- Reduce **Scrollback Buffer** line count

### How to reset the interface layout?

Use **View → Reset Panel Layout**.

## Security

### Forgot the master password?

The master password encrypts session data. If forgotten, delete the config files in `~/.dragonfly/` and reconfigure.

:::warning
Deleting config files will lose all saved connections and keys.
:::

### Forgot the screen lock password?

Manually edit `~/.dragonfly/settings.json` and reset the lock-related settings.

## Other

### How to import sessions from other SSH clients?

Currently supports WindTerm:

1. Right-click the sidebar and select **Import Sessions**
2. Choose WindTerm
3. Select the WindTerm session config file

### Where are config files stored?

All configs are in `~/.dragonfly/`, including connections, keys, and settings.

### How to view application logs?

Via **Help → View Logs**. Logs rotate daily with 7-day retention.
