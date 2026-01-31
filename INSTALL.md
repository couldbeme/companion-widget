# Quick Install Guide

**Time: 2 minutes. Prerequisites: OpenClaw macOS app connected to a gateway (local or remote).**

---

## One-Liner Install

```bash
git clone https://github.com/couldbeme/companion-widget.git \
  ~/Library/Application\ Support/OpenClaw/canvas/main/companion && \
  openclaw nodes canvas present && \
  openclaw nodes canvas navigate --url "/companion/"
```

Done. Your companion is floating on your desktop.

---

## Step-by-Step

### 1. Make sure OpenClaw is connected

**Local gateway:**
```bash
openclaw gateway status
# If not running: openclaw gateway
```

**Remote gateway (Tailscale/SSH/VPS):**
Your gateway runs on a server. The macOS app connects to it remotely.
See [OpenClaw remote setup](https://docs.openclaw.ai/gateway/remote).

### 2. Make sure macOS app is connected

Open **OpenClaw.app** from Applications. You should see the lobster 🦞 in your menu bar.

- **Local mode:** App connects to gateway on your Mac
- **Remote mode:** App connects to gateway on your server (via Tailscale/SSH)

Check nodes:
```bash
openclaw nodes list
```

You should see your Mac listed as a node (works in both local and remote mode).

### 3. Install the companion widget

```bash
git clone https://github.com/couldbeme/companion-widget.git \
  ~/Library/Application\ Support/OpenClaw/canvas/main/companion
```

### 4. Show it

```bash
# Present the canvas panel
openclaw nodes canvas present

# Navigate to companion
openclaw nodes canvas navigate --url "/companion/"
```

### 5. Talk to your AI

Send a message via Telegram, Discord, WhatsApp, or terminal — watch your companion react!

---

## Troubleshooting

### "node required" error

Your macOS app isn't connected. Check:
```bash
openclaw nodes list
```

If empty, open OpenClaw.app and ensure it's in Local mode.

### Canvas doesn't appear

Enable canvas in macOS app: **Settings → Allow Canvas**

### Companion doesn't react

Make sure you're talking to your AI through OpenClaw channels (Telegram, Discord, etc.), not directly to the widget.

---

## Update

```bash
cd ~/Library/Application\ Support/OpenClaw/canvas/main/companion
git pull
```

The canvas auto-reloads when files change.

---

## Uninstall

```bash
rm -rf ~/Library/Application\ Support/OpenClaw/canvas/main/companion
openclaw nodes canvas hide
```
