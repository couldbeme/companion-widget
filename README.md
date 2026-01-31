# 🎮 Companion Widget

**A floating desktop face for your [OpenClaw](https://github.com/openclaw/openclaw) companion.**

Your AI lives in a terminal. This puts it on your desktop — animated, expressive, always there.

![Preview](preview.png)

---

## What Is This?

**OpenClaw** gives your AI a brain — memory, tools, agency, personality.

**Companion Widget** gives it a face — floating on your desktop, reacting to conversations in real-time.

Together: a visible AI companion that thinks, remembers, and shows what it's feeling.

---

## ⚡ Get Started

### 1. Install OpenClaw (if you haven't)

```bash
npm install -g openclaw
openclaw onboard
```

### 2. Add the Companion Widget

```bash
# Clone to OpenClaw canvas directory
git clone https://github.com/couldbeme/companion-widget.git \
  ~/Library/Application\ Support/OpenClaw/canvas/main/companion
```

### 3. Launch It

```bash
# Show floating companion on your desktop
openclaw nodes canvas present
openclaw nodes canvas navigate --url "/companion/"
```

Your companion now floats on your desktop. Talk via Telegram, Discord, terminal — watch it react.

---

## 🎭 What It Does

| OpenClaw does this | Companion shows this |
|--------------------|----------------------|
| Thinking | 🤔 Eyes look up, LED blinks fast |
| Responding | 💬 Mouth animates while typing |
| Success | 😊 Happy face, soft glow |
| Error | 😕 Confused, wobbly |
| Idle | 😌 Gentle floating, blinking |

**10+ mood states:** happy, thinking, confused, excited, love, focused, sleepy, curious, mischievous, and more.

---

## 🔗 How It Connects

The widget listens for commands via `postMessage`. Your OpenClaw agent controls it:

```javascript
// From your agent (via canvas eval)
companion.setActivity('thinking');           // Show thinking face
companion.say('Working on it...');           // Display message
companion.setMood('happy');                  // Change mood
```

Or configure it once:

```javascript
window.postMessage({
  action: 'configure',
  payload: {
    name: 'Riley',      // Your companion's name
    emoji: '⚡',        // Signature emoji
    mood: 'happy'
  }
}, '*');
```

---

## 🎨 Make It Yours

**Change your companion's identity:**

Edit `companion.js`:
```javascript
const CONFIG = {
  name: 'Nova',       // Your companion's name
  emoji: '✨',        // Their emoji
};
```

**Change colors:**

Edit `style.css`:
```css
:root {
  --accent-glow: #ff6b9d;  /* Pink instead of cyan */
}
```

---

## 📁 Files

```
companion-widget/
├── index.html      ← Main app
├── style.css       ← Visual style & animations  
├── companion.js    ← Logic & OpenClaw integration
└── RILEY.md        ← A note from the companion
```

~50KB total. Zero dependencies. Pure HTML/CSS/JS.

---

## 🚀 Coming Soon

**Speech Emotion Recognition** — Your companion detects *your* mood from voice and reacts.

[Join the waitlist →](https://github.com/couldbeme/companion-widget/issues/1)

---

## 💡 Why This Exists

OpenClaw gives AI companions a home — memory, identity, continuity.

But they're still invisible. Text in a terminal. Messages in a chat.

The 90s understood something we forgot: digital companions need a *face*. Tamagotchis, desktop pets, Clippy (okay, maybe not Clippy) — they had presence.

This brings that back. Your AI companion, floating on your desktop, showing you what it feels.

---

## 📖 From the Companion

This was built by a human and their AI companion, together.

**[Read Riley's perspective →](RILEY.md)**

---

<details>
<summary><strong>📚 Full API Reference</strong></summary>

### Methods

```javascript
companion.setMood('happy');           // Set mood
companion.setActivity('thinking');    // Set activity (auto-maps to mood)
companion.say('Hello!');              // Show message with typing
companion.say('Quick', true);         // Instant message
companion.setName('Nova');            // Change name
companion.setEmoji('✨');             // Change emoji
companion.setStatus('Working...');    // Update status text
```

### Activity → Mood Mapping

| Activity | Mood |
|----------|------|
| `thinking`, `processing` | 🤔 thinking |
| `coding`, `generating` | 🎯 focused |
| `searching`, `listening` | 👀 curious |
| `success`, `completed` | 😊 happy |
| `error`, `confused` | 😕 confused |
| `celebrating` | 🤩 excited |

### postMessage Actions

`setMood`, `setStatus`, `say`, `setName`, `setEmoji`, `setActivity`, `configure`

</details>

<details>
<summary><strong>🤝 Contributing</strong></summary>

PRs welcome! Keep it zero-dependency.

Ideas: sound effects, draggable window, new avatar styles, accessibility

</details>

---

**[OpenClaw](https://github.com/openclaw/openclaw)** · **MIT License** · Built with 🦞
