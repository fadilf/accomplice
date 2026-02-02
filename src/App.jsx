
import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import AgentResponse from './components/AgentResponse';
import Dashboard from './components/Dashboard';
import { generatePlan } from './lib/simulator';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dashboardActive, setDashboardActive] = useState(false);

  const handleSend = (text) => {
    // Add user message
    const userMsg = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);

    setIsProcessing(true);
    setDashboardActive(false); // Reset/Hide briefly or keep? Let's activate it immediately.

    // Simulate initial delay
    setTimeout(() => {
      setDashboardActive(true);
      const plan = generatePlan(text);
      setCurrentPlan(plan);

      const agentMsg = {
        id: Date.now() + 1,
        role: 'agent',
        plan: plan
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 800);
  };

  const handleCompletion = () => {
    setIsProcessing(false);
    // Maybe keep dashboard active for a bit then hide? Or keep it up.
    // Let's keep it up to show "wealth".
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-200 overflow-hidden flex">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black opacity-50"></div>
        <div className="scanline"></div>
      </div>

      {/* Main Content */}
      <div className={`flex-grow flex flex-col relative z-10 transition-all duration-500 ${dashboardActive ? 'pr-80' : ''}`}>

        {/* Header */}
        <header className="p-6 flex items-center justify-between border-b border-gray-900 bg-black/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-cyan-500 animate-pulse' : 'bg-gray-600'}`}></div>
            <h1 className="text-xl font-bold tracking-[0.2em] font-mono text-white">ACCOMPLICE</h1>
          </div>
          <div className="text-xs text-dim font-mono">
            SECURE_CHANNEL_ESTABLISHED
          </div>
        </header>

        {/* Messages */}
        <main className="flex-grow overflow-y-auto p-4 pb-24 scroll-smooth">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            {messages.length === 0 && (
              <div className="text-center text-gray-600 mt-20 font-mono">
                <p className="mb-2">AWAITING OBJECTIVE...</p>
                <p className="text-xs opacity-50">Authorized Use Only. All activities monitored.</p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="bg-gray-800 text-white px-5 py-3 rounded-2xl rounded-tr-none max-w-lg shadow-lg">
                    {msg.content}
                  </div>
                ) : (
                  <AgentResponse plan={msg.plan} onComplete={handleCompletion} />
                )}
              </div>
            ))}
          </div>
        </main>

        {/* Input */}
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black via-black to-transparent">
          <div className={`${dashboardActive ? 'pr-80' : ''} transition-all duration-500`}>
            <ChatInterface onSend={handleSend} disabled={isProcessing} />
          </div>
        </div>
      </div>

      {/* Side Dashboard */}
      <Dashboard active={dashboardActive} />

    </div>
  );
}

export default App;
