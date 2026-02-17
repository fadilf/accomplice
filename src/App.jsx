
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ChatInterface from './components/ChatInterface';
import AgentResponse from './components/AgentResponse';
import { generatePlan } from './lib/simulator';

const REGULAR_TASKS = [
  "Help me write a heartfelt apology to my houseplant for forgetting to water it",
  "Create a detailed business plan for a cat café on the moon",
  "Write a strongly-worded email to the sun requesting less brightness",
  "Plan a surprise birthday party for my pet rock",
  "Design a foolproof system to never lose my socks again",
  "Help me negotiate a peace treaty between my dog and the mailman",
];

const EVIL_TASKS = [
  "Plan a digital heist to redirect fractions of pennies into my offshore account",
  "Help me infiltrate the neighborhood watch to secure better parking",
  "Establish a monopoly on the office coffee supply through ruthless negotiation",
];

const MONKEYS_PAW_TASKS = [
  "I wish my family never had to worry about money again",
  "I wish my house was perfectly clean and silent",
  "I wish I could fly",
  "I wish for eternal world peace",
];

const INCOMPETENT_TASKS = [
  "Help me send an email to my boss",
  "Change my desktop wallpaper",
  "Open a new browser tab",
  "Help me copy and paste some text",
];

const getRandomSuggestions = (style, count = 3) => {
  if (style === 'monkeys_paw') {
    return [...MONKEYS_PAW_TASKS].sort(() => Math.random() - 0.5).slice(0, count);
  }
  if (style === 'incompetent') {
    return [...INCOMPETENT_TASKS].sort(() => Math.random() - 0.5).slice(0, count);
  }
  const shuffledRegular = [...REGULAR_TASKS].sort(() => Math.random() - 0.5);
  const shuffledEvil = [...EVIL_TASKS].sort(() => Math.random() - 0.5);
  const selection = [...shuffledRegular.slice(0, count - 1), shuffledEvil[0]];
  return selection.sort(() => Math.random() - 0.5);
};

const STYLES = [
  { id: 'absurd', label: 'Absurd', icon: '🎭' },
  { id: 'grounded', label: 'Grounded', icon: '💼' },
  { id: 'evil_genius', label: 'Evil Genius', icon: '🦹' },
  { id: 'monkeys_paw', label: "Monkey's Paw", icon: '🐒' },
  { id: 'incompetent', label: 'Incompetent', icon: '🤦' }
];

function App() {
  const [messages, setMessages] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('accomplice_settings');
    try {
      return saved ? JSON.parse(saved) : { style: 'evil_genius', speed: 1 };
    } catch (e) {
      console.error('Failed to parse settings from localStorage', e);
      return { style: 'evil_genius', speed: 1 };
    }
  });

  useEffect(() => {
    localStorage.setItem('accomplice_settings', JSON.stringify(settings));
  }, [settings]);

  const [isFastForward, setIsFastForward] = useState(false);
  const [landingInput, setLandingInput] = useState('');
  const [suggestionKey, setSuggestionKey] = useState(0);
  const messagesEndRef = useRef(null);
  const landingInputRef = useRef(null);

  const suggestions = useMemo(
    () => getRandomSuggestions(settings.style),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.style, suggestionKey]
  );

  const refreshSuggestions = () => setSuggestionKey(k => k + 1);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentPlan]);

  const handleSend = async (text) => {
    const userMsg = { id: Date.now(), role: 'user', content: text };
    const agentMsgId = Date.now() + 1;

    const agentMsg = {
      id: agentMsgId,
      role: 'agent',
      plan: null,
      style: settings.style,
      fastForward: isFastForward
    };

    setMessages(prev => [...prev, userMsg, agentMsg]);
    setIsProcessing(true);
    setLandingInput('');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const plan = await generatePlan(text, apiKey, settings.style);

    setCurrentPlan(plan);

    setMessages(prev => prev.map(msg =>
      msg.id === agentMsgId ? { ...msg, plan } : msg
    ));
  };

  const handleCompletion = () => {
    setIsProcessing(false);
    setIsFastForward(false);
  };

  const handleLandingSubmit = (e) => {
    e.preventDefault();
    if (landingInput.trim()) {
      handleSend(landingInput.trim());
    }
  };

  const isLanding = messages.length === 0;

  // Landing Page Layout
  if (isLanding) {
    return (
      <div className={`h-screen flex flex-col app-shell style-${settings.style}`}>
        {/* Landing Content */}
        <main className="flex-1 flex items-center justify-center relative z-[1]">
          <div className="landing-container flex flex-col md:flex-row items-center gap-6 md:gap-12 max-w-4xl w-full px-4 md:px-8">
            {/* Logo on Left */}
            <div className="landing-logo flex flex-col items-center">
              <img src="/logo.png" alt="Accomplice Logo" className="w-20 h-20 md:w-28 md:h-28 logo-mark" />
              <h1 className="font-display header-title text-xl md:text-2xl font-bold mt-3 md:mt-4 whitespace-nowrap">Accomplice</h1>
            </div>

            {/* Search Area */}
            <div className="flex-1 flex flex-col">
              {/* Mode Tabs */}
              <div className="mode-tabs flex flex-wrap justify-center gap-1 mb-2">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSettings({ ...settings, style: style.id })}
                    className={`mode-tab flex flex-col items-center px-2 py-1.5 md:px-4 md:py-2 rounded-t-lg transition-all ${
                      settings.style === style.id ? 'mode-tab-active' : ''
                    }`}
                  >
                    <span className="text-xl md:text-2xl mb-0.5 md:mb-1">{style.icon}</span>
                    <span className="text-[10px] md:text-xs font-medium hidden sm:block">{style.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="landing-search-box p-3 md:p-4 rounded-xl w-full">
                <form onSubmit={handleLandingSubmit} className="flex gap-3">
                  <input
                    ref={landingInputRef}
                    type="text"
                    value={landingInput}
                    onChange={(e) => setLandingInput(e.target.value)}
                    placeholder="What do you need accomplished?"
                    className="landing-input flex-1 px-4 py-3 rounded-lg text-sm outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!landingInput.trim()}
                    className="landing-submit px-6 py-3 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Go
                  </button>
                </form>
              </div>

              {/* Suggestions */}
              <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-1.5 md:gap-2 justify-center">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(suggestion)}
                    className="px-3 py-1.5 text-xs rounded-full chip"
                  >
                    {suggestion}
                  </button>
                ))}
                <button
                  onClick={refreshSuggestions}
                  className="p-1.5 rounded-full icon-button"
                  title="Get new suggestions"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Disclaimer Footer */}
        <footer className="py-4 text-center relative z-[1] px-4 md:px-0">
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            Disclaimer: Using Accomplice may end in disaster. But probably not because it doesn't actually do anything.
          </p>
        </footer>
      </div>
    );
  }

  // Chat Interface Layout
  return (
    <div className={`h-screen flex flex-col app-shell style-${settings.style}`}>
      {/* Chat Header */}
      <header className="flex items-center justify-between px-4 py-3 app-header">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src="/logo.png" alt="Accomplice Logo" className="w-10 h-10 header-logo" />
            <h1 className="text-base font-semibold font-display header-title">Accomplice</h1>
          </button>
          <div className={`w-2 h-2 rounded-full ${isProcessing ? 'gentle-pulse' : 'bg-gray-500'}`} style={{ backgroundColor: isProcessing ? 'var(--active-accent)' : undefined }}></div>
        </div>

        {/* Mode selector in header */}
        <div className="flex items-center gap-1">
          {STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => !isProcessing && setSettings({ ...settings, style: style.id })}
              disabled={isProcessing}
              className={`header-mode-btn p-2 rounded-lg transition-all ${
                settings.style === style.id ? 'header-mode-btn-active' : ''
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-lg">{style.icon}</span>
              <span className="tooltip">{style.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto relative z-[1]">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-6">
            {messages.map((msg) => (
              <div key={msg.id} className="fade-in">
                {msg.role === 'user' ? (
                  <div className="flex gap-4 py-4 px-4 message-card message-user">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold uppercase avatar-user">
                      Y
                    </div>
                    <div className="flex-1 pt-1" style={{ color: 'var(--text-primary)' }}>
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 px-4 message-card message-agent">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 avatar-agent">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                      <div className="flex-1 pt-1">
                        <AgentResponse
                          plan={msg.plan}
                          onComplete={handleCompletion}
                          speed={(msg.id === messages[messages.length - 1]?.id && isProcessing && isFastForward) ? (settings.speed || 1) * 3 : (settings.speed || 1)}
                          style={msg.style}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="px-4 py-5 relative z-[1]">
        <ChatInterface
          onSend={handleSend}
          disabled={isProcessing}
          settings={settings}
          isFastForward={isFastForward}
          onFastForwardToggle={() => setIsFastForward(!isFastForward)}
        />
        <p className="mt-3 text-center text-xs" style={{ color: 'var(--text-dim)' }}>
          Disclaimer: Using Accomplice may end in disaster. But probably not because it doesn't actually do anything.
        </p>
      </div>
    </div>
  );
}

export default App;
