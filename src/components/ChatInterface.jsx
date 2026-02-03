
import React, { useState, useEffect } from 'react';

const REGULAR_TASKS = [
    "Help me write a heartfelt apology to my houseplant for forgetting to water it",
    "Create a detailed business plan for a cat café on the moon",
    "Write a strongly-worded email to the sun requesting less brightness",
    "Plan a surprise birthday party for my pet rock",
    "Design a foolproof system to never lose my socks again",
    "Help me negotiate a peace treaty between my dog and the mailman",
    "Create a workout routine for my goldfish",
    "Write a motivational speech for procrastinators (but maybe later)",
    "Help me compose a love letter to pizza",
    "Design a resume for my very talented but lazy couch",
    "Create a survival guide for Monday mornings",
    "Write instructions for teaching my cat to file my taxes",
    "Plan a vacation itinerary for my houseplants",
    "Help me draft a formal complaint to gravity"
];

const EVIL_TASKS = [
    "Plan a digital heist to redirect fractions of pennies into my offshore account",
    "Help me infiltrate the neighborhood watch to secure better parking",
    "Draft an unethical plan to buy out all the local ice cream trucks",
    "Create a subtle way to gaslight my coworkers into thinking Monday is actually Tuesday",
    "Design a script to anonymously sign my enemies up for Ostrich-of-the-Month newsletters",
    "Establish a monopoly on the office coffee supply through ruthless negotiation",
    "Help me frame my rival for the mysterious disappearance of the office stapler",
    "Plan a takeover of the library's quiet room for my evil lair",
    "Formulate a plan to seize control of the building's thermostat at 2 AM",
    "Create a guide for becoming a local urban legend to keep people off my lawn"
];

const MONKEYS_PAW_TASKS = [
    "I wish my family never had to worry about money again",
    "I wish my house was perfectly clean and silent",
    "I wish I could be with my late grandfather again",
    "I wish I had the most powerful computer in the world",
    "I wish for eternal world peace",
    "I wish I could fly",
    "I wish I was the smartest person on Earth",
    "I wish for a never-ending summer",
    "I wish my boss would stop emailing me",
    "I wish I could see into the future"
];

const getRandomSuggestions = (style, count = 3) => {
    if (style === 'monkeys_paw') {
        const shuffled = [...MONKEYS_PAW_TASKS].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    const shuffledRegular = [...REGULAR_TASKS].sort(() => Math.random() - 0.5);
    const shuffledEvil = [...EVIL_TASKS].sort(() => Math.random() - 0.5);

    const selection = [
        ...shuffledRegular.slice(0, count - 1),
        shuffledEvil[0]
    ];

    // Shuffle final selection so the evil one isn't always last
    return selection.sort(() => Math.random() - 0.5);
};

const ChatInterface = ({ onSend, disabled, settings }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState(() => getRandomSuggestions(settings?.style));

    useEffect(() => {
        setSuggestions(getRandomSuggestions(settings?.style));
    }, [settings?.style]);

    const refreshSuggestions = () => {
        setSuggestions(getRandomSuggestions(settings?.style));
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
                <div className="mb-4 flex flex-wrap items-center gap-2 justify-center">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
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
            )}
            <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-end gap-3 rounded-2xl px-4 py-3 input-shell">
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
                        className="flex-1 bg-transparent resize-none outline-none text-sm input-text"
                        style={{ maxHeight: '200px' }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || disabled}
                        className="p-2 rounded-lg send-button disabled:opacity-40"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </div>
            </form>
            <p className="text-center text-xs mt-3" style={{ color: 'var(--text-dim)' }}>
                Accomplice may cause catastrophic consequences. Use wisely... or don't.
            </p>
        </div>
    );
};

export default ChatInterface;
