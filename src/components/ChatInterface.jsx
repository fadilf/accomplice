
import React, { useState } from 'react';

const ChatInterface = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="max-w-2xl w-full mx-auto p-4">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={disabled}
                    placeholder={disabled ? "Operation in progress..." : "Enter objective..."}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-4 px-6 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || disabled}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </form>
            <div className="text-center mt-2 text-xs text-gray-700 font-mono">
                ACCOMPLICE v1.0.4 [UNREGISTERED COPY]
            </div>
        </div>
    );
};

export default ChatInterface;
