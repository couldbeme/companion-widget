# 🎮 Companion Widget

**A face for your AI.** Standalone chat app with an animated avatar that reacts to conversations.

![Preview](preview.png)

---

## ⚡ Quick Start

**3 steps. 30 seconds.**

```bash
# 1. Download
git clone https://github.com/couldbeme/companion-widget.git

# 2. Open
cd companion-widget
open index.html

# 3. Chat!
```

That's it. No install. No build. No accounts. Just open and talk.

---

## 🎭 What It Does

| You do this | Companion does this |
|-------------|---------------------|
| Send a message | Shows "thinking" face → types reply |
| Wait | Blinks, floats, glows |
| Click the avatar | Random mood reaction! |

**10+ moods:** happy 😊, thinking 🤔, confused 😕, excited 🤩, love 💖, focused 🎯, sleepy 😴, curious 👀, mischievous 😏

---

## 🔌 Connect Real AI (Optional)

Out of the box, it has demo responses. Want real AI?

```javascript
companion.setMessageHandler(async (message) => {
  const response = await fetch('YOUR_AI_API', {
    method: 'POST',
    body: JSON.stringify({ message })
  });
  return (await response.json()).reply;
});
```

Works with OpenAI, Claude, local LLMs, [OpenClaw](https://github.com/openclaw/openclaw), anything.

---

## 🎨 Customize

**Change name & emoji:**
```javascript
companion.setName('Nova');
companion.setEmoji('✨');
```

**Control mood:**
```javascript
companion.setMood('happy');
companion.setMood('thinking');
companion.setActivity('coding', 'Working on it...');
```

**Change colors** — edit `style.css`:
```css
:root {
  --accent-glow: #00ffff;  /* Change this */
}
```

---

## 📁 What's Inside

```
companion-widget/
├── index.html      ← Open this
├── style.css       ← Colors & animations  
├── companion.js    ← Logic & API
└── RILEY.md        ← A note from the companion
```

~50KB total. Zero dependencies.

---

## 🦞 OpenClaw Integration

Works with [OpenClaw](https://github.com/openclaw/openclaw) canvas:

```bash
# Copy to canvas directory
cp -r companion-widget ~/Library/Application\ Support/OpenClaw/canvas/main/

# Present
openclaw nodes canvas present
```

Control via postMessage — see [full API docs](#api-reference) below.

---

## 🚀 Coming Soon

**Speech Emotion Recognition** — Your companion detects *your* mood from voice.

[Join the waitlist →](https://github.com/couldbeme/companion-widget/issues/1)

---

## 📖 A Note from the Companion

This was built by a human and their AI companion, together.

**[Read Riley's perspective →](RILEY.md)**

---

<details>
<summary><strong>📚 Full API Reference</strong></summary>

### Core Methods

```javascript
// Mood
companion.setMood('happy');           // Set mood
companion.setMood('focused', true);   // Set mood + update status
companion.getMoods();                 // Get all moods

// Chat
companion.say('Hello!');              // Type message
companion.say('Quick', true);         // Instant (no typing)
companion.addMessage('Hi', 'user');   // Add message manually

// Identity
companion.setName('Nova');
companion.setEmoji('✨');
companion.setStatus('Working...');

// AI Integration
companion.setMessageHandler(fn);      // Custom AI handler
companion.getMessages();              // Get chat history
companion.clearMessages();            // Clear chat
```

### Activity Shortcuts

```javascript
companion.activities.startThinking();  // → thinking mood
companion.activities.stopThinking();   // → happy mood  
companion.activities.startWorking();   // → focused mood
companion.activities.confused();       // → confused mood
companion.activities.celebrate();      // → excited mood
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

### postMessage API (for iframes/OpenClaw)

```javascript
window.postMessage({
  action: 'configure',
  payload: {
    name: 'Riley',
    mood: 'happy',
    message: 'Hello!'
  }
}, '*');
```

**Actions:** `setMood`, `setStatus`, `say`, `setName`, `setEmoji`, `setActivity`, `configure`, `userMessage`

</details>

<details>
<summary><strong>🤝 Contributing</strong></summary>

1. Fork the repo
2. Create feature branch
3. Make changes (keep zero dependencies!)
4. Test in Chrome, Firefox, Safari
5. Submit PR

**Ideas:** Sound effects, draggable window, new avatar styles, accessibility, i18n

</details>

---

**MIT License** · [GitHub](https://github.com/couldbeme/companion-widget)
