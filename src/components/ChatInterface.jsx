
import React, { useState, useEffect } from 'react';

const SUGGESTED_TASKS = [
    "Help me write a heartfelt apology to my houseplant for forgetting to water it",
    "Create a detailed business plan for a cat café on the moon",
    "Write a strongly-worded email to the sun requesting less brightness",
    "Plan a surprise birthday party for my pet rock",
    "Design a foolproof system to never lose my socks again",
    "Help me negotiate a peace treaty between my dog and the mailman",
    "Create a workout routine for my goldfish",
    "Write a motivational speech for procrastinators (but maybe later)",
    "Plan a heist to steal all the pens at my office",
    "Help me compose a love letter to pizza",
    "Design a resume for my very talented but lazy couch",
    "Create a survival guide for Monday mornings",
    "Write instructions for teaching my cat to file my taxes",
    "Plan a vacation itinerary for my houseplants",
    "Help me draft a formal complaint to gravity"
];

const getRandomSuggestions = (count = 3) => {
    const shuffled = [...SUGGESTED_TASKS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

const ChatInterface = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState(() => getRandomSuggestions());

    const refreshSuggestions = () => {
        setSuggestions(getRandomSuggestions());
    };

    const handleSuggestionClick = (suggestion) => {
        if (!disabled) {
            onSend(suggestion);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Suggested Tasks */}
            {!disabled && (
                <div className="mb-3 flex flex-wrap items-center gap-2 justify-center">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 text-xs rounded-full border transition-all hover:scale-105 hover:border-emerald-500/50"
                            style={{
                                backgroundColor: 'rgba(64, 65, 79, 0.6)',
                                borderColor: 'rgba(86, 88, 105, 0.7)',
                                color: '#c5c5d2'
                            }}
                        >
                            {suggestion.length > 40 ? suggestion.slice(0, 40) + '...' : suggestion}
                        </button>
                    ))}
                    <button
                        onClick={refreshSuggestions}
                        className="p-1.5 rounded-full transition-all hover:bg-white/10"
                        title="Get new suggestions"
                        style={{ color: '#8e8ea0' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>
            )}
            <form onSubmit={handleSubmit} className="relative">
                <div
                    className="flex items-end gap-3 rounded-xl border px-4 py-3 shadow-lg"
                    style={{
                        backgroundColor: '#40414f',
                        borderColor: 'rgba(86,88,105,0.7)'
                    }}
                >
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            // Auto-resize textarea
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        disabled={disabled}
                        placeholder={disabled ? "Waiting for response..." : "Send a message..."}
                        rows={1}
                        className="flex-1 bg-transparent resize-none outline-none text-sm"
                        style={{
                            color: '#ececf1',
                            maxHeight: '200px'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || disabled}
                        className="p-2 rounded-lg transition-all disabled:opacity-30"
                        style={{
                            backgroundColor: input.trim() && !disabled ? '#10a37f' : 'transparent',
                            color: input.trim() && !disabled ? 'white' : '#8e8ea0'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </div>
            </form>
            <p className="text-center text-xs mt-2" style={{ color: '#8e8ea0' }}>
                Accomplice may produce inaccurate information about people, places, or facts.
            </p>
        </div>
    );
};

export default ChatInterface;
