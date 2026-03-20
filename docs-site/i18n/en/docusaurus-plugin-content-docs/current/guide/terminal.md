---
sidebar_position: 3
---

# Terminal Features

Dragonfly provides a feature-rich terminal emulator powered by xterm.js.

## Rendering

### Hardware Acceleration

WebGL rendering is enabled by default, leveraging the GPU for smooth scrolling and output.

Toggle in **Settings → Terminal → Hardware Acceleration**.

### Font Configuration

- **Font Family** — Multiple fallback fonts, primary font has highest priority
- **Font Size** — Terminal and UI font sizes are independently adjustable
- **Font Ligatures** — Enable programming font ligature support

Built-in fonts include JetBrains Mono and Noto Sans SC. System fonts are also available.

### Cursor Styles

Three cursor styles:
- Block
- Underline
- Bar

Cursor blink can be toggled on/off.

## Terminal Operations

### Context Menu

Right-click in the terminal for:

- Copy / Paste
- Paste selected text
- Find text
- Search selected text online
- Translate selected text
- Clear screen / Clear all
- Select all

### Scrollback Buffer

The terminal retains a configurable number of history lines (default 1000). Scroll up with the mouse wheel.

Adjust in **Settings → Terminal → Scrollback Buffer**.

### Clipboard

- **Copy on Select** — Automatically copy selected text to clipboard
- **Right-click Paste** — Paste clipboard content on right-click

Configure in **Settings → Interaction**.

## Keyword Highlighting

### Built-in Rules

Automatically highlights common patterns including:
- Date/time formats
- Numbers
- Error/warning keywords

Built-in rules adapt to the current theme automatically.

### Custom Rules

Add custom rules in **Settings → Terminal → Keyword Highlighting**:

1. Set a rule name
2. Choose a highlight color
3. Add matching patterns (regex supported), one per line

Custom rules take priority over built-in rules.

## Command History

Commands are automatically recorded per session, searchable via fuzzy matching in the **Command History** panel.

## Auto-Complete Suggestions

The terminal shows command suggestions based on history while typing.

## Keep-Alive

Configure SSH Keep-Alive interval to prevent idle disconnections:

- Set in **Settings → Terminal → Keep-Alive Interval**
- Set to 0 to disable

## Remote Resource Monitoring

Enable **Show Remote Resource Stats** in **Settings → Terminal** to display CPU and memory usage of the active SSH host in the status bar, updated every 10 seconds.
