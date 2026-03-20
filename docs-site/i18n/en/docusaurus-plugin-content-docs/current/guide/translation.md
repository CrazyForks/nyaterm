---
sidebar_position: 6
---

# Translation

Dragonfly includes a multi-engine text translation feature for quickly translating unfamiliar text in the terminal.

## Usage

1. Select text in the terminal
2. Right-click and choose **Translate**
3. The translation result appears in a popup window

## Supported Engines

| Engine | Configuration Required |
|--------|----------------------|
| Google Translate | No configuration needed |
| Microsoft Translate | No configuration needed |
| DeepL | API Key required |
| Baidu Translate | App ID + App Key required |
| Alibaba Translate | App ID + App Key required |
| Youdao Translate | App ID + App Key required |

## Configuration

Configure in **Settings → Translation**:

- **Provider** — Select the default translation engine
- **Target Language** — Set the translation target language
- **API Credentials** — Enter API credentials for engines that require them

Google and Microsoft Translate work out of the box with no configuration needed.
