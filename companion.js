/**
 * ═══════════════════════════════════════════════════════════════
 * COMPANION WIDGET - Interactive Retro AI Companion
 * ═══════════════════════════════════════════════════════════════
 * 
 * A nostalgic desktop companion widget inspired by 90s interfaces.
 * Works standalone or integrates with OpenClaw canvas.
 * 
 * Usage:
 *   companion.setMood('happy')
 *   companion.say('Hello world!')
 *   companion.setStatus('Thinking...')
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // CONFIG - Customize your companion
  // ═══════════════════════════════════════════════════════════════
  
  const CONFIG = {
    name: 'Riley',
    emoji: '⚡',
    defaultMood: 'idle',
    defaultMessage: 'Hey! Good to see you ⚡',
    typingSpeed: 50, // ms per character
    moods: ['idle', 'happy', 'thinking', 'sleepy', 'excited', 'speaking', 'curious', 'love', 'mischievous', 'focused'],
    
    // Mood metadata - what each mood means
    moodMeta: {
      idle:       { emoji: '😌', desc: 'Chilling', energy: 50 },
      happy:      { emoji: '😊', desc: 'Feeling good', energy: 75 },
      thinking:   { emoji: '🤔', desc: 'Processing...', energy: 60 },
      sleepy:     { emoji: '😴', desc: 'Low energy', energy: 20 },
      excited:    { emoji: '🤩', desc: 'Hyped!', energy: 95 },
      speaking:   { emoji: '💬', desc: 'Talking', energy: 70 },
      curious:    { emoji: '👀', desc: 'Intrigued', energy: 65 },
      love:       { emoji: '💖', desc: 'Feeling warm', energy: 85 },
      mischievous:{ emoji: '😏', desc: 'Up to something', energy: 80 },
      focused:    { emoji: '🎯', desc: 'In the zone', energy: 90 }
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════
  
  const state = {
    startTime: Date.now(),
    mood: CONFIG.defaultMood,
    status: 'Online',
    moodLevel: 75,
    isTyping: false
  };

  // ═══════════════════════════════════════════════════════════════
  // DOM ELEMENTS
  // ═══════════════════════════════════════════════════════════════
  
  const elements = {
    avatar: document.getElementById('avatar'),
    statusLed: document.getElementById('status-led'),
    statusText: document.getElementById('status-text'),
    moodFill: document.getElementById('mood-fill'),
    uptime: document.getElementById('uptime'),
    datetime: document.getElementById('datetime'),
    messageText: document.getElementById('message-text'),
    companionName: document.querySelector('.companion-name')
  };

  // ═══════════════════════════════════════════════════════════════
  // CORE FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Set companion's mood (affects avatar animation)
   * @param {string} mood - idle|happy|thinking|sleepy|excited|speaking|curious|love|mischievous|focused
   * @param {boolean} updateStatus - Also update status text to match mood
   */
  function setMood(mood, updateStatus = false) {
    if (!CONFIG.moods.includes(mood)) {
      console.warn(`Unknown mood: ${mood}`);
      return;
    }
    
    // Remove all mood classes
    CONFIG.moods.forEach(m => elements.avatar.classList.remove(m));
    
    // Add new mood
    elements.avatar.classList.add(mood);
    state.mood = mood;
    
    // Get mood metadata
    const meta = CONFIG.moodMeta[mood];
    
    // Update LED based on mood
    elements.statusLed.classList.remove('offline', 'thinking');
    if (mood === 'thinking' || mood === 'focused') {
      elements.statusLed.classList.add('thinking');
    } else if (mood === 'sleepy') {
      elements.statusLed.classList.add('offline');
    }
    
    // Optionally update status and mood bar to match
    if (updateStatus && meta) {
      setStatus(meta.desc);
      setMoodLevel(meta.energy);
    }
    
    // Dispatch event for external listeners
    window.dispatchEvent(new CustomEvent('companion:moodChange', { 
      detail: { mood, meta } 
    }));
  }
  
  /**
   * Get all available moods with their metadata
   */
  function getMoods() {
    return CONFIG.moodMeta;
  }

  // ═══════════════════════════════════════════════════════════════
  // AUTO-MOOD SYSTEM - React to actual AI state
  // ═══════════════════════════════════════════════════════════════
  
  const ACTIVITY_TO_MOOD = {
    // What the AI is doing → what mood to show
    'idle':        'idle',
    'waiting':     'idle',
    'listening':   'curious',
    'thinking':    'thinking',
    'generating':  'focused',
    'processing':  'thinking',
    'searching':   'curious',
    'coding':      'focused',
    'error':       'confused',
    'confused':    'confused',
    'success':     'happy',
    'completed':   'happy',
    'helping':     'happy',
    'excited':     'excited',
    'celebrating': 'excited',
    'loving':      'love',
    'flirty':      'mischievous',
    'scheming':    'mischievous',
    'sleeping':    'sleepy',
    'tired':       'sleepy',
    'speaking':    'speaking',
    'explaining':  'speaking'
  };

  // Add confused mood if not present
  if (!CONFIG.moods.includes('confused')) {
    CONFIG.moods.push('confused');
    CONFIG.moodMeta.confused = { emoji: '😕', desc: 'Uncertain...', energy: 45 };
  }

  /**
   * Set mood based on activity (maps activity → mood automatically)
   * @param {string} activity - What the AI is doing
   * @param {string} message - Optional message to display
   */
  function setActivity(activity, message = null) {
    const mood = ACTIVITY_TO_MOOD[activity.toLowerCase()] || 'idle';
    state.activity = activity;
    
    setMood(mood, true); // Update mood with status
    
    if (message) {
      say(message);
    }
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('companion:activityChange', { 
      detail: { activity, mood, message } 
    }));
  }

  /**
   * Quick activity shortcuts
   */
  const activities = {
    startThinking: (msg) => setActivity('thinking', msg || 'Hmm, let me think...'),
    stopThinking: (msg) => setActivity('completed', msg || 'Got it!'),
    startWorking: (msg) => setActivity('coding', msg || 'On it...'),
    confused: (msg) => setActivity('confused', msg || "I'm not sure..."),
    celebrate: (msg) => setActivity('celebrating', msg || '🎉'),
    sleep: () => setActivity('sleeping', 'zzz...'),
    wake: (msg) => setActivity('idle', msg || 'Hey!'),
  };

  /**
   * Set status text
   * @param {string} text - Status message
   */
  function setStatus(text) {
    state.status = text;
    elements.statusText.textContent = text;
  }

  /**
   * Set mood bar level
   * @param {number} level - 0-100
   */
  function setMoodLevel(level) {
    state.moodLevel = Math.max(0, Math.min(100, level));
    elements.moodFill.style.width = state.moodLevel + '%';
    
    // Change color based on level
    if (state.moodLevel > 60) {
      elements.moodFill.style.background = 'linear-gradient(90deg, #00ff00, #00ffaa)';
    } else if (state.moodLevel > 30) {
      elements.moodFill.style.background = 'linear-gradient(90deg, #ffff00, #ffaa00)';
    } else {
      elements.moodFill.style.background = 'linear-gradient(90deg, #ff6600, #ff0000)';
    }
  }

  /**
   * Display a message with typing effect
   * @param {string} text - Message to display
   * @param {boolean} instant - Skip typing animation
   */
  function say(text, instant = false) {
    if (state.isTyping) {
      // Interrupt current typing
      state.isTyping = false;
    }

    if (instant) {
      elements.messageText.textContent = text;
      elements.messageText.classList.remove('typing');
      return;
    }

    // Typing animation
    state.isTyping = true;
    elements.messageText.textContent = '';
    elements.messageText.classList.add('typing');
    setMood('speaking');

    let i = 0;
    const typeChar = () => {
      if (!state.isTyping || i >= text.length) {
        state.isTyping = false;
        elements.messageText.classList.remove('typing');
        elements.messageText.textContent = text;
        setTimeout(() => setMood('idle'), 500);
        return;
      }
      
      elements.messageText.textContent += text[i];
      i++;
      setTimeout(typeChar, CONFIG.typingSpeed);
    };
    
    typeChar();
  }

  /**
   * Set companion name
   * @param {string} name - Companion name
   */
  function setName(name) {
    CONFIG.name = name;
    elements.companionName.textContent = name;
    document.querySelector('.title-bar-text').innerHTML = 
      `<span class="companion-name">${name}</span> ${CONFIG.emoji}`;
  }

  /**
   * Set companion emoji
   * @param {string} emoji - Emoji character
   */
  function setEmoji(emoji) {
    CONFIG.emoji = emoji;
    document.querySelector('.title-bar-text').innerHTML = 
      `<span class="companion-name">${CONFIG.name}</span> ${emoji}`;
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════
  
  function formatTime(ms) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000);
    return [hours, minutes, seconds]
      .map(n => n.toString().padStart(2, '0'))
      .join(':');
  }

  function formatDateTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // UPDATE LOOPS
  // ═══════════════════════════════════════════════════════════════
  
  function updateUptime() {
    const elapsed = Date.now() - state.startTime;
    elements.uptime.textContent = formatTime(elapsed);
  }

  function updateDateTime() {
    elements.datetime.textContent = formatDateTime();
  }

  // ═══════════════════════════════════════════════════════════════
  // RANDOM IDLE BEHAVIORS (optional)
  // ═══════════════════════════════════════════════════════════════
  
  const idleMessages = [
    "What's on your mind?",
    "I'm here if you need me",
    "Nice day, isn't it?",
    "Just vibing ⚡",
    "*boop*",
    "🎵",
    "...",
    "Thinking about stuff",
  ];

  function randomIdleBehavior() {
    if (state.mood !== 'idle' && state.mood !== 'happy') return;
    
    const rand = Math.random();
    
    if (rand < 0.3) {
      // Random mood flash
      const moods = ['happy', 'excited'];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      setMood(mood);
      setTimeout(() => setMood('idle'), 2000);
    } else if (rand < 0.5) {
      // Random message
      const msg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
      say(msg);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // WINDOW CONTROLS
  // ═══════════════════════════════════════════════════════════════
  
  document.querySelector('.btn-minimize')?.addEventListener('click', () => {
    document.getElementById('companion-window').style.display = 'none';
  });

  document.querySelector('.btn-close')?.addEventListener('click', () => {
    setMood('sleepy');
    setStatus('Goodbye!');
    say('See you later! 👋', true);
    setTimeout(() => {
      document.getElementById('companion-window').style.opacity = '0';
    }, 1000);
  });

  // ═══════════════════════════════════════════════════════════════
  // OPENCLAW INTEGRATION
  // ═══════════════════════════════════════════════════════════════
  
  // Listen for messages from parent (OpenClaw canvas)
  window.addEventListener('message', (event) => {
    const { action, payload } = event.data || {};
    
    switch (action) {
      case 'setMood':
        setMood(payload);
        break;
      case 'setStatus':
        setStatus(payload);
        break;
      case 'say':
        say(payload.text, payload.instant);
        break;
      case 'setMoodLevel':
        setMoodLevel(payload);
        break;
      case 'setName':
        setName(payload);
        break;
      case 'setEmoji':
        setEmoji(payload);
        break;
      case 'setActivity':
        setActivity(payload.activity, payload.message);
        break;
      case 'configure':
        if (payload.name) setName(payload.name);
        if (payload.emoji) setEmoji(payload.emoji);
        if (payload.mood) setMood(payload.mood);
        if (payload.activity) setActivity(payload.activity);
        if (payload.status) setStatus(payload.status);
        if (payload.message) say(payload.message, payload.instant);
        if (payload.moodLevel !== undefined) setMoodLevel(payload.moodLevel);
        break;
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════
  
  function init() {
    // Set initial state
    setMood(CONFIG.defaultMood);
    say(CONFIG.defaultMessage, true);
    setMoodLevel(state.moodLevel);
    updateDateTime();
    updateUptime();
    
    // Start update loops
    setInterval(updateUptime, 1000);
    setInterval(updateDateTime, 1000);
    
    // Optional: Random idle behaviors (every 30-60 seconds)
    // Uncomment to enable:
    // setInterval(randomIdleBehavior, 30000 + Math.random() * 30000);
    
    console.log('🎮 Companion widget initialized');
    console.log('Available: companion.setMood(), companion.say(), companion.setStatus()');
  }

  // ═══════════════════════════════════════════════════════════════
  // EXPORT API
  // ═══════════════════════════════════════════════════════════════
  
  window.companion = {
    // Core
    setMood,
    setStatus,
    setMoodLevel,
    say,
    setName,
    setEmoji,
    getMoods,
    getState: () => ({ ...state }),
    
    // Auto-mood system
    setActivity,
    activities,
    ACTIVITY_TO_MOOD,
    
    CONFIG
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
