---
sidebar_position: 3
---

# Frontend Development

## Project Structure

Frontend code is in `src/`, using React 19 + TypeScript.

## Component Development

### UI Component Library

The project uses [shadcn/ui](https://ui.shadcn.com/):

- Components in `src/components/ui/`
- Built on Radix UI primitives
- Styled with TailwindCSS

### Adding Components

```bash
npx shadcn@latest add button
```

### Icons

Uses [Lucide React](https://lucide.dev/):

```tsx
import { Terminal } from 'lucide-react';

<Terminal className="w-4 h-4" />
```

## State Management

### AppContext
Core application state: active sessions, saved connections, active tab, settings.

### ThemeContext
Theme state: current theme, terminal color scheme, font configuration.

### TransferContext
File transfer state: transfer queue, progress, completion/error status.

## Calling Tauri Commands

Use `@tauri-apps/api` to invoke backend commands:

```typescript
import { invoke } from '@tauri-apps/api/core';

const sessionId = await invoke<string>('create_ssh_session', {
  connectionId: 'uuid-here'
});

const files = await invoke<FileEntry[]>('list_remote_dir', {
  sessionId: 'session-id',
  path: '/home/user'
});
```

## Listening to Events

```typescript
import { listen } from '@tauri-apps/api/event';

const unlisten = await listen<string>(`terminal-output-${sessionId}`, (event) => {
  terminal.write(event.payload);
});

unlisten(); // Cleanup
```

## Internationalization

### Adding Translations

Add key-value pairs to JSON files in `src/i18n/locales/`.

### Using Translations

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <span>{t('menu.file')}</span>;
}
```

## Terminal Integration

Terminal uses xterm.js with key addons:

- **WebGL Addon** — GPU-accelerated rendering
- **Fit Addon** — Auto-resize to container
- **Search Addon** — Text search
- **Web Links Addon** — Clickable URLs

```typescript
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';

const terminal = new Terminal({
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 16,
  cursorBlink: true,
});

const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.loadAddon(new WebglAddon());
```
