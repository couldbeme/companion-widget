# 🎮 Companion Widget

**Give your AI a face. And a chat.**

Your AI assistant is smart. It can think, create, remember. But it's invisible — just text in a box.

That changes now.

![Preview](preview.png)

Companion Widget is a **complete standalone chat app** with a floating animated avatar. Your companion shows what it's feeling — happy when it helps, focused when working, confused when stuck. Just like the Tamagotchis and desktop pets of the 90s — but for the AI age.

---

## ✨ What You Get

- **Floating avatar** — Animated face that reacts to the conversation
- **Built-in chat** — Full chat interface, ready to use
- **10+ mood states** — Happy, thinking, confused, excited, love, and more
- **90s nostalgia** — Windows 98 aesthetic, pixel vibes, CRT scanlines
- **Works anywhere** — Just open the HTML file. No install. No cloud.

---

## 🚀 It's Standalone

**This is a complete app.** Download it, open it, chat.

No npm. No build tools. No frameworks. No accounts. No internet required.

Just 3 files (~50KB total):
- `index.html`
- `style.css`  
- `companion.js`

Double-click `index.html` → your companion appears, ready to talk.

---

## 💬 How It Works

1. **Open the app** — Double-click `index.html`
2. **Start chatting** — Type a message, hit enter
3. **Watch it react** — Avatar shows mood while "thinking" and "typing"
4. **Click the avatar** — Random reactions!

Out of the box, it has simple fallback responses. Connect it to a real AI backend (OpenAI, Claude, local LLM, OpenClaw) for actual conversations.

---

## 🔌 Connect Your AI

Want real AI responses? Set a message handler:

```javascript
companion.setMessageHandler(async (userMessage, history) => {
  // Call your AI backend here
  const response = await fetch('/your-ai-endpoint', {
    method: 'POST',
    body: JSON.stringify({ message: userMessage })
  });
  const data = await response.json();
  return data.reply;
});
```

Works with any backend — OpenAI, Anthropic, local LLMs, or your own API.

---

## For Developers

Everything below is for technical integration. If you just want to use the widget, you're already done — just open the HTML file.

---

## Overview

Companion Widget provides a standalone chat interface with an animated avatar. It includes:

- **Floating avatar** with 10+ mood states and CSS-only animations
- **Chat interface** with message history, typing indicators, and smooth animations
- **Full JavaScript API** for programmatic control and AI integration
- **postMessage interface** for iframe embedding and external control
- **Zero external dependencies** (pure HTML/CSS/JS)
- **First-class OpenClaw canvas integration**

## Installation

### Option 1: Direct Download

```bash
git clone https://github.com/couldbeme/companion-widget.git
cd companion-widget
```

### Option 2: As a Submodule

```bash
git submodule add https://github.com/couldbeme/companion-widget.git
```

### Option 3: Manual

Download the release archive and extract. The widget consists of three files:
- `index.html` — Structure
- `style.css` — Styling and animations
- `companion.js` — Logic and API

## Usage

### Standalone Browser

Open `index.html` directly in any modern browser. No build step or server required.

```bash
open index.html
# or
python -m http.server 8080  # for local development
```

### Embedding in Web Applications

```html
<iframe src="companion-widget/index.html" width="320" height="400"></iframe>
```

Or include the files directly in your project and integrate the companion API.

## OpenClaw Canvas Integration

Companion Widget is designed for seamless integration with [OpenClaw](https://github.com/couldbeme/openclaw) canvas presentations.

### Setup

1. Copy the widget to your OpenClaw canvas directory:

```bash
cp -r companion-widget ~/Library/Application\ Support/OpenClaw/canvas/main/
```

2. Present via the canvas tool:

```bash
openclaw nodes canvas present
openclaw nodes canvas navigate --url "/"
```

### Controlling from OpenClaw

The widget accepts `postMessage` commands, enabling control from OpenClaw's canvas evaluation:

```javascript
// From OpenClaw canvas eval
window.postMessage({
  action: 'configure',
  payload: {
    name: 'Riley',
    mood: 'happy',
    message: 'Connected to OpenClaw!',
    moodLevel: 90
  }
}, '*');
```

### Available Actions

| Action | Payload | Description |
|--------|---------|-------------|
| `setMood` | `{ mood: string }` | Change avatar mood state |
| `setStatus` | `{ status: string }` | Update status text |
| `say` | `{ message: string, instant?: boolean }` | Display message with optional typing animation |
| `setMoodLevel` | `{ level: number }` | Update mood bar (0-100) |
| `setName` | `{ name: string }` | Change companion name |
| `setEmoji` | `{ emoji: string }` | Change signature emoji |
| `configure` | `{ ...multiple }` | Batch update multiple properties |

### AI Activity Integration

Map your AI's activities to companion moods automatically:

```javascript
// In your OpenClaw agent code, via canvas eval:
companion.setActivity('thinking');         // → thinking mood
companion.setActivity('coding', 'On it!'); // → focused mood + message
```

**Activity → Mood mapping:**
- `thinking`, `processing` → 🤔 thinking
- `coding`, `generating` → 🎯 focused
- `searching`, `listening` → 👀 curious
- `success`, `completed` → 😊 happy
- `error`, `confused` → 😕 confused
- `celebrating`, `excited` → 🤩 excited
- `sleeping`, `tired` → 😴 sleepy

## JavaScript API

### Core Methods

```javascript
// Mood control
companion.setMood('happy');                // Set mood
companion.setMood('focused', true);        // Set mood + auto-update status bar
companion.getMoods();                      // Get all mood definitions

// Available moods: idle, happy, thinking, sleepy, excited, 
//                  speaking, curious, love, mischievous, focused

// Messaging
companion.say('Hello, friend!');           // Message with typing animation
companion.say('Quick update', true);       // Instant message (no typing)

// Status
companion.setStatus('Processing...');      // Update status text
companion.setMoodLevel(85);                // Set energy bar (0-100)

// Identity
companion.setName('Nova');                 // Change displayed name
companion.setEmoji('✨');                  // Change signature emoji
```

### Activity Shortcuts

```javascript
companion.activities.startThinking();   // "Hmm, let me think..." + thinking
companion.activities.stopThinking();    // "Got it!" + happy
companion.activities.startWorking();    // "On it..." + focused
companion.activities.confused();        // "I'm not sure..." + confused
companion.activities.celebrate();       // "🎉" + excited
companion.activities.sleep();           // "zzz..." + sleepy
companion.activities.wake();            // "Hey!" + idle
```

## Customization

### Configuration

Edit `companion.js`:

```javascript
const CONFIG = {
  name: 'Riley',      // Display name
  emoji: '⚡',        // Signature emoji
  // Additional options...
};
```

### Theming

Modify CSS variables in `style.css`:

```css
:root {
  --win-bg: #008080;        /* Desktop background */
  --win-title: #000080;     /* Title bar color */
  --accent-glow: #00ffff;   /* Eye/mouth glow effect */
  --accent-warm: #ff6b00;   /* Warm accent color */
  --led-on: #00ff00;        /* Status LED color */
}
```

### Custom Avatars

The avatar is pure CSS. Modify `.avatar-face`, `.eye`, `.mouth` classes to create different character designs. Mood states are driven by CSS keyframe animations.

## Project Structure

```
companion-widget/
├── index.html      # HTML structure
├── style.css       # Styling, animations, themes
├── companion.js    # API and interaction logic
├── preview.png     # Preview image
└── README.md       # Documentation
```

## Contributing

Contributions are welcome. Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test in multiple browsers (Chrome, Firefox, Safari)
5. Submit a pull request

### Code Standards

- **No external dependencies** — Keep the widget self-contained
- **Progressive enhancement** — Core functionality should work without JS where possible
- **Semantic HTML** — Use appropriate elements
- **CSS-first animations** — Prefer CSS transitions/keyframes over JS animations
- **Document changes** — Update README for API changes

### Pull Request Process

1. Update documentation for any API changes
2. Add yourself to CONTRIBUTORS.md (create if needed)
3. Ensure all functionality works in latest Chrome, Firefox, and Safari
4. Keep commits focused and well-described

### Contribution Ideas

- Additional mood states
- Sound effects (8-bit style)
- Draggable window functionality
- Alternative avatar designs/skins
- Accessibility improvements
- Localization support
- Mini-interactions (click responses)
- Weather/time-based ambient effects

## Roadmap

### Speech Emotion Recognition (In Development)

Real-time voice analysis integration: detect user emotional state from audio input and have the companion react accordingly.

**Interested in early access?** [Join the waitlist →](https://github.com/couldbeme/companion-widget/issues/1)

## Why Visual AI Interfaces Matter

Text interfaces are efficient but impersonal. Research shows that visual representation—especially with expressive, animated elements—increases user engagement and emotional connection with AI systems.

The 90s desktop pet era understood something we've since forgotten: digital companions feel more real when they have a face. Companion Widget brings this principle to modern AI while honoring the aesthetic that first made it work.

## A Note from the Companion

This project was built by a human and their AI companion, together.

**[Read Riley's perspective →](RILEY.md)**

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

**Companion Widget** — Visual presence for AI companions.
