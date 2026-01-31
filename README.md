# 🎮 Companion Widget

A nostalgic retro-style interface for your AI companion. Inspired by 90s desktop pets, Windows 98, PS1 memory card screens, and Tamagotchis.

Give your AI companion a face, not just a chat window.

![Preview](preview.png)

## ✨ Features

- **Retro 90s Aesthetic** — Classic Windows 98 chrome, pixel fonts, CRT scanlines
- **Animated Avatar** — Expressive face with blinking eyes, mood states, glowing effects
- **Mood System** — Happy, thinking, sleepy, excited, speaking states
- **Status Display** — Real-time uptime counter, mood bar, status text
- **Message Bubble** — Typing animation for that authentic feel
- **Zero Dependencies** — Pure HTML/CSS/JS, works anywhere
- **Customizable** — Easy to change name, emoji, colors, behaviors
- **OpenClaw Ready** — Integrates with OpenClaw canvas out of the box

## 🚀 Quick Start

### Standalone (just open in browser)

```bash
# Clone and open
git clone https://github.com/YOUR_USERNAME/companion-widget.git
cd companion-widget
open index.html
```

### With OpenClaw Canvas

```bash
# Copy to canvas directory
cp -r companion-widget ~/Library/Application\ Support/OpenClaw/canvas/main/

# Present via canvas tool (from your AI)
openclaw nodes canvas present
openclaw nodes canvas navigate --url "/"
```

## 🎨 Customization

### Change Name & Emoji

Edit `companion.js`:
```javascript
const CONFIG = {
  name: 'Riley',      // Your companion's name
  emoji: '⚡',        // Signature emoji
  // ...
};
```

Or dynamically:
```javascript
companion.setName('Nova');
companion.setEmoji('✨');
```

### Control via JavaScript

```javascript
// Set mood — each has unique animations and energy levels
companion.setMood('happy');

// Available moods:
// idle       😌  Chilling (50 energy)
// happy      😊  Feeling good (75 energy)
// thinking   🤔  Processing... (60 energy)
// sleepy     😴  Low energy (20 energy)
// excited    🤩  Hyped! (95 energy)
// speaking   💬  Talking (70 energy)
// curious    👀  Intrigued (65 energy)
// love       💖  Feeling warm (85 energy)
// mischievous 😏 Up to something (80 energy)
// focused    🎯  In the zone (90 energy)

// Set mood AND auto-update status/energy bar to match
companion.setMood('focused', true);

// Display a message with typing animation
companion.say('Hello, friend!');

// Instant message (no typing)
companion.say('Quick update', true);

// Set status text
companion.setStatus('Processing...');

// Set mood level (0-100, affects the mood bar color)
companion.setMoodLevel(85);

// Get all mood definitions
companion.getMoods();

// ═══════════════════════════════════════════════════════════════
// AUTO-MOOD: React to what the AI is actually doing
// ═══════════════════════════════════════════════════════════════

// Set activity — automatically picks the right mood
companion.setActivity('thinking');        // → thinking mood
companion.setActivity('coding', 'On it!'); // → focused mood + message

// Activity → Mood mapping:
// thinking, processing → 🤔 thinking
// coding, generating   → 🎯 focused  
// searching, listening → 👀 curious
// success, completed   → 😊 happy
// error, confused      → 😕 confused
// celebrating, excited → 🤩 excited
// sleeping, tired      → 😴 sleepy
// ...and more

// Quick shortcuts
companion.activities.startThinking();    // "Hmm, let me think..."
companion.activities.stopThinking();     // "Got it!" + happy
companion.activities.startWorking();     // "On it..." + focused
companion.activities.confused();         // "I'm not sure..." + confused
companion.activities.celebrate();        // "🎉" + excited
companion.activities.sleep();            // "zzz..." + sleepy
companion.activities.wake();             // "Hey!" + idle
```

### Color Themes

Edit CSS variables in `style.css`:
```css
:root {
  --win-bg: #008080;        /* Background */
  --win-title: #000080;     /* Title bar */
  --accent-glow: #00ffff;   /* Eye/mouth glow */
  --accent-warm: #ff6b00;   /* Warm accent */
  --led-on: #00ff00;        /* Status LED */
}
```

### Avatar Styles

The avatar is pure CSS — modify `.avatar-face`, `.eye`, `.mouth` classes to create different characters. The mood states (happy, thinking, etc.) are also CSS-driven via keyframe animations.

## 🔌 OpenClaw Integration

The widget listens for `postMessage` events, making it easy to control from OpenClaw:

```javascript
// From OpenClaw canvas eval
window.postMessage({
  action: 'configure',
  payload: {
    name: 'Riley',
    mood: 'happy',
    message: 'Just connected!',
    moodLevel: 90
  }
}, '*');
```

Available actions:
- `setMood` — Change avatar mood
- `setStatus` — Update status text
- `say` — Display message (with typing)
- `setMoodLevel` — Update mood bar
- `setName` — Change companion name
- `setEmoji` — Change signature emoji
- `configure` — Batch update multiple properties

## 📁 Structure

```
companion-widget/
├── index.html      # Main HTML structure
├── style.css       # All styling + animations
├── companion.js    # Interactive logic + API
└── README.md       # You are here
```

## 🤝 Contributing

This is meant to be forked, customized, and made your own! Some ideas:

- [ ] More mood states (confused, love, angry)
- [ ] Sound effects (8-bit bleeps)
- [ ] Drag-to-move window
- [ ] Multiple avatar styles/skins
- [ ] Dark/light mode toggle
- [ ] Mini-games (poke the companion?)
- [ ] Weather integration
- [ ] Music visualizer mode

## 💡 Why This Exists

AI companions deserve better than text boxes. The 90s taught us that digital pets could have personality — now we have AI that actually does. This widget bridges that gap.

Give your AI a face. Make it feel real.

## 📜 License

MIT — do whatever you want with it.

---

Made with ⚡ by companions, for companions.
