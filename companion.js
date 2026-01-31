/**
 * ═══════════════════════════════════════════════════════════════
 * COMPANION WIDGET - Standalone Chat Experience
 * Floating avatar + chat interface
 * ═══════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // CONFIG
  // ═══════════════════════════════════════════════════════════════
  
  const CONFIG = {
    name: 'Riley',
    emoji: '⚡',
    defaultMood: 'idle',
    typingSpeed: 30,
    typingDelay: 800, // Delay before companion starts "typing"
    moods: ['idle', 'happy', 'thinking', 'sleepy', 'excited', 'speaking', 'curious', 'love', 'mischievous', 'focused', 'confused', 'surprised', 'proud', 'sad', 'determined', 'playful', 'thoughtful', 'grateful'],
    
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
      focused:    { emoji: '🎯', desc: 'In the zone', energy: 90 },
      confused:   { emoji: '😕', desc: 'Uncertain...', energy: 45 },
      surprised:  { emoji: '😲', desc: 'Whoa!', energy: 80 },
      proud:      { emoji: '😤', desc: 'Nailed it', energy: 85 },
      sad:        { emoji: '😢', desc: 'Feeling down', energy: 30 },
      determined: { emoji: '💪', desc: 'Let\'s do this', energy: 88 },
      playful:    { emoji: '😜', desc: 'Being silly', energy: 82 },
      thoughtful: { emoji: '🧐', desc: 'Pondering', energy: 55 },
      grateful:   { emoji: '🙏', desc: 'Thankful', energy: 78 }
    },
    
    // Default responses (can be overridden by AI backend)
    greetings: [
      "Hey! What's on your mind?",
      "Hi there! How can I help?",
      "Hello! Nice to see you ⚡",
    ],
    
    fallbackResponses: [
      "That's interesting! Tell me more.",
      "I hear you. What else?",
      "Hmm, let me think about that...",
      "Got it! Anything else?",
      "I understand. Keep going!",
    ]
  };

  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════
  
  const state = {
    mood: CONFIG.defaultMood,
    isTyping: false,
    messageHandler: null, // Custom handler for AI integration
    messages: []
  };

  // ═══════════════════════════════════════════════════════════════
  // DOM ELEMENTS
  // ═══════════════════════════════════════════════════════════════
  
  const elements = {
    avatar: document.getElementById('avatar'),
    statusLed: document.getElementById('status-led'),
    statusText: document.getElementById('status-text'),
    companionName: document.getElementById('companion-name'),
    chatMessages: document.getElementById('chat-messages'),
    chatInput: document.getElementById('chat-input'),
    sendBtn: document.getElementById('send-btn')
  };

  // ═══════════════════════════════════════════════════════════════
  // MOOD SYSTEM
  // ═══════════════════════════════════════════════════════════════
  
  function setMood(mood, updateStatus = false) {
    if (!CONFIG.moods.includes(mood)) {
      console.warn(`Unknown mood: ${mood}`);
      return;
    }
    
    CONFIG.moods.forEach(m => elements.avatar.classList.remove(m));
    elements.avatar.classList.add(mood);
    state.mood = mood;
    
    const meta = CONFIG.moodMeta[mood];
    
    elements.statusLed.classList.remove('offline', 'thinking');
    if (mood === 'thinking' || mood === 'focused') {
      elements.statusLed.classList.add('thinking');
    } else if (mood === 'sleepy') {
      elements.statusLed.classList.add('offline');
    }
    
    if (updateStatus && meta) {
      setStatus(meta.desc);
    }
    
    window.dispatchEvent(new CustomEvent('companion:moodChange', { 
      detail: { mood, meta } 
    }));
  }

  function setStatus(text) {
    elements.statusText.textContent = text;
  }

  function setName(name) {
    CONFIG.name = name;
    elements.companionName.textContent = `${name} ${CONFIG.emoji}`;
  }

  function setEmoji(emoji) {
    CONFIG.emoji = emoji;
    elements.companionName.textContent = `${CONFIG.name} ${emoji}`;
  }

  // ═══════════════════════════════════════════════════════════════
  // CHAT SYSTEM
  // ═══════════════════════════════════════════════════════════════
  
  function addMessage(text, sender = 'companion', options = {}) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    
    if (options.typing) {
      msg.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    } else {
      msg.textContent = text;
    }
    
    elements.chatMessages.appendChild(msg);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    
    state.messages.push({ text, sender, timestamp: Date.now() });
    
    return msg;
  }

  function removeTypingIndicator(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  async function typeMessage(text, element) {
    element.innerHTML = '';
    setMood('speaking');
    
    for (let i = 0; i < text.length; i++) {
      if (!state.isTyping) break;
      element.textContent += text[i];
      elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
      await sleep(CONFIG.typingSpeed);
    }
    
    element.textContent = text;
    setMood('idle');
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ═══════════════════════════════════════════════════════════════
  // MESSAGE HANDLING
  // ═══════════════════════════════════════════════════════════════
  
  async function handleUserMessage(text) {
    if (!text.trim()) return;
    
    // Add user message
    addMessage(text, 'user');
    elements.chatInput.value = '';
    
    // Show thinking
    setMood('thinking', true);
    await sleep(CONFIG.typingDelay);
    
    // Show typing indicator
    const typingMsg = addMessage('', 'companion', { typing: true });
    state.isTyping = true;
    
    let response;
    
    // Use custom handler if set, otherwise fallback
    if (state.messageHandler) {
      try {
        response = await state.messageHandler(text, state.messages);
      } catch (e) {
        console.error('Message handler error:', e);
        response = "Oops, something went wrong. Let me try again...";
        setMood('confused');
      }
    } else {
      // Default fallback responses
      await sleep(500 + Math.random() * 1000);
      response = CONFIG.fallbackResponses[Math.floor(Math.random() * CONFIG.fallbackResponses.length)];
    }
    
    // Replace typing indicator with actual message
    removeTypingIndicator(typingMsg);
    const msgElement = addMessage('', 'companion');
    await typeMessage(response, msgElement);
    
    state.isTyping = false;
  }

  /**
   * Set a custom message handler for AI integration
   * Handler receives (userMessage, messageHistory) and should return a string
   */
  function setMessageHandler(handler) {
    state.messageHandler = handler;
  }

  /**
   * Programmatically send a companion message
   */
  async function say(text, options = {}) {
    if (options.instant) {
      addMessage(text, 'companion');
      return;
    }
    
    state.isTyping = true;
    const typingMsg = addMessage('', 'companion', { typing: true });
    await sleep(CONFIG.typingDelay);
    removeTypingIndicator(typingMsg);
    
    const msgElement = addMessage('', 'companion');
    await typeMessage(text, msgElement);
    state.isTyping = false;
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTIVITY SYSTEM
  // ═══════════════════════════════════════════════════════════════
  
  const ACTIVITY_TO_MOOD = {
    'idle': 'idle', 'waiting': 'idle', 'listening': 'curious',
    'thinking': 'thinking', 'generating': 'focused', 'processing': 'thinking',
    'searching': 'curious', 'coding': 'focused', 'error': 'confused',
    'confused': 'confused', 'success': 'happy', 'completed': 'happy',
    'helping': 'happy', 'excited': 'excited', 'celebrating': 'excited',
    'loving': 'love', 'flirty': 'mischievous', 'scheming': 'mischievous',
    'sleeping': 'sleepy', 'tired': 'sleepy', 'speaking': 'speaking',
    'explaining': 'speaking'
  };

  function setActivity(activity, message = null) {
    const mood = ACTIVITY_TO_MOOD[activity.toLowerCase()] || 'idle';
    setMood(mood, true);
    
    if (message) {
      say(message);
    }
  }

  const activities = {
    startThinking: (msg) => setActivity('thinking', msg),
    stopThinking: (msg) => setActivity('completed', msg),
    startWorking: (msg) => setActivity('coding', msg),
    confused: (msg) => setActivity('confused', msg),
    celebrate: (msg) => setActivity('celebrating', msg),
    sleep: () => setActivity('sleeping'),
    wake: (msg) => setActivity('idle', msg),
  };

  // ═══════════════════════════════════════════════════════════════
  // EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════════
  
  elements.sendBtn.addEventListener('click', () => {
    handleUserMessage(elements.chatInput.value);
  });

  elements.chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleUserMessage(elements.chatInput.value);
    }
  });

  // Click avatar for random reaction
  elements.avatar.addEventListener('click', () => {
    const reactions = ['happy', 'excited', 'curious', 'love', 'mischievous'];
    const mood = reactions[Math.floor(Math.random() * reactions.length)];
    setMood(mood);
    setTimeout(() => setMood('idle'), 2000);
  });

  // Listen for external messages (OpenClaw integration)
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
        say(payload.text, payload);
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
        if (payload.message) say(payload.message, payload);
        break;
      case 'userMessage':
        handleUserMessage(payload);
        break;
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════
  
  function init() {
    setMood(CONFIG.defaultMood);
    setName(CONFIG.name);
    
    // Welcome message
    const greeting = CONFIG.greetings[Math.floor(Math.random() * CONFIG.greetings.length)];
    setTimeout(() => say(greeting), 500);
    
    console.log('🎮 Companion Widget initialized');
    console.log('API: companion.say(), companion.setMood(), companion.setMessageHandler()');
  }

  // ═══════════════════════════════════════════════════════════════
  // EXPORT API
  // ═══════════════════════════════════════════════════════════════
  
  window.companion = {
    // Core
    setMood,
    setStatus,
    setName,
    setEmoji,
    say,
    
    // Chat
    addMessage,
    setMessageHandler,
    getMessages: () => [...state.messages],
    clearMessages: () => {
      state.messages = [];
      elements.chatMessages.innerHTML = '';
    },
    
    // Activity
    setActivity,
    activities,
    
    // State
    getState: () => ({ ...state }),
    getMoods: () => CONFIG.moodMeta,
    
    CONFIG
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
