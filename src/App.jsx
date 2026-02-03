
import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from './components/ChatInterface';
import AgentResponse from './components/AgentResponse';
import SettingsDialog from './components/SettingsDialog';
import { generatePlan } from './lib/simulator';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ style: 'evil_genius' });
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
    setMessages(prev => [...prev, userMsg]);

    setIsProcessing(true);

    // Simulate initial delay
    setTimeout(async () => {

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const plan = await generatePlan(text, apiKey, settings.style);

      setCurrentPlan(plan);

      const agentMsg = {
        id: Date.now() + 1,
        role: 'agent',
        plan: plan,
        style: settings.style
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 800);
  };

  const handleCompletion = () => {
    setIsProcessing(false);
  };

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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-md icon-button"
            title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z" />
            </svg>
          </button>
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
                          speed={settings.speed || 1}
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

      {/* Input */}
      <div className="px-4 py-5">
        <ChatInterface onSend={handleSend} disabled={isProcessing} settings={settings} />
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}

export default App;
