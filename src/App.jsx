
import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from './components/ChatInterface';
import AgentResponse from './components/AgentResponse';
import { generatePlan } from './lib/simulator';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentPlan]);

  const handleSend = async (text) => {
    // Add user message
    const userMsg = { id: Date.now(), role: 'user', content: text };
    const agentMsgId = Date.now() + 1;

    // Add agent message immediately with null plan to show thinking state
    const agentMsg = {
      id: agentMsgId,
      role: 'agent',
      plan: null,
      style: settings.style,
      fastForward: isFastForward
    };

    setMessages(prev => [...prev, userMsg, agentMsg]);
    setIsProcessing(true);

    // Generate the plan
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const plan = await generatePlan(text, apiKey, settings.style);

    setCurrentPlan(plan);

    // Update the agent message with the plan
    setMessages(prev => prev.map(msg =>
      msg.id === agentMsgId ? { ...msg, plan } : msg
    ));
  };

  const handleCompletion = () => {
    setIsProcessing(false);
    setIsFastForward(false); // Reset fast forward when task completes
  };

  const STYLES = [
    { id: 'absurd', label: 'Absurd', icon: '🎭' },
    { id: 'grounded', label: 'Grounded', icon: '💼' },
    { id: 'evil_genius', label: 'Evil Genius', icon: '🦹' },
    { id: 'monkeys_paw', label: 'Monkey\'s Paw', icon: '🐒' },
    { id: 'incompetent', label: 'Incompetent', icon: '🤦' }
  ];

  const currentStyleLabel = STYLES.find(s => s.id === settings.style)?.label || 'Style';
  const currentStyleIcon = STYLES.find(s => s.id === settings.style)?.icon || '⚙️';

  return (
    <div className="h-screen flex flex-col app-shell">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 app-header">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-emerald-500 gentle-pulse' : 'bg-gray-500'}`}></div>
            <h1 className="text-base font-semibold font-display" style={{ color: 'var(--text-primary)' }}>Accomplice</h1>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/5 active:scale-95"
            style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <span>{currentStyleIcon}</span>
            <span>{currentStyleLabel}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 rounded-xl p-1 z-20 shadow-2xl animate-in fade-in zoom-in duration-200 border border-white/10" style={{ backgroundColor: 'rgb(13, 18, 28)', backdropFilter: 'blur(12px)' }}>
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSettings({ ...settings, style: style.id });
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors hover:bg-white/5 ${settings.style === style.id ? 'bg-white/10' : ''}`}
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span>{style.icon}</span>
                    <span>{style.label}</span>
                    {settings.style === style.id && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-auto text-emerald-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-32 text-center">
              <img src="/logo.png" alt="Accomplice Logo" className="w-16 h-16 mb-6 logo-mark" />
              <h2 className="font-display hero-title font-semibold mb-2">How can I help you today?</h2>
              <p className="text-sm hero-subtitle">Ask me anything and I'll help you accomplish it.</p>
            </div>
          )}

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

      <div className="px-4 py-5">
        <ChatInterface
          onSend={handleSend}
          disabled={isProcessing}
          settings={settings}
          isFastForward={isFastForward}
          onFastForwardToggle={() => setIsFastForward(!isFastForward)}
        />
      </div>
    </div>
  );
}

export default App;
