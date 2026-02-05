import React, { useState, useEffect, useRef } from 'react';

const AgentResponse = ({ plan, onComplete, speed = 1, style }) => {
    const [stage, setStage] = useState('thinking'); // thinking, executing, done
    const [items, setItems] = useState([]);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState(-1);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (plan) {
            setItems(plan);
            setStage('thinking');

            // Brief thinking delay before starting
            setTimeout(() => {
                setStage('executing');
            }, 1500 / speed);
        }
    }, [plan]);

    useEffect(() => {
        if (stage !== 'executing') return;

        if (currentItemIndex >= items.length) {
            setStage('done');
            if (onComplete) onComplete();
            return;
        }

        const currentItem = items[currentItemIndex];

        // Handle thought and planning types - simple timed display
        if (currentItem.type === 'thought' || currentItem.type === 'planning') {
            // Mark as active
            setItems(prev => {
                const newItems = [...prev];
                if (newItems[currentItemIndex].status === 'active') return newItems;
                newItems[currentItemIndex] = { ...newItems[currentItemIndex], status: 'active' };
                return newItems;
            });

            const timer = setTimeout(() => {
                // Mark as done
                setItems(prev => {
                    const newItems = [...prev];
                    newItems[currentItemIndex] = { ...newItems[currentItemIndex], status: 'done' };
                    return newItems;
                });
                setCurrentItemIndex(prev => prev + 1);
            }, currentItem.duration / speed);

            return () => clearTimeout(timer);
        }

        // Handle task type - with subtasks
        if (currentItem.type === 'task') {
            const subtasks = currentItem.subtasks || [];
            const hasSubtasks = subtasks.length > 0;

            // --- SUBTASK EXECUTION LOOP ---
            if (hasSubtasks && currentSubtaskIndex >= 0 && currentSubtaskIndex < subtasks.length) {
                const activeSub = subtasks[currentSubtaskIndex];

                // Mark subtask active
                setItems(prev => {
                    const newItems = [...prev];
                    const activeSubs = [...newItems[currentItemIndex].subtasks];
                    if (activeSubs[currentSubtaskIndex].status === 'active') return newItems;
                    activeSubs[currentSubtaskIndex] = { ...activeSubs[currentSubtaskIndex], status: 'active' };
                    newItems[currentItemIndex] = { ...newItems[currentItemIndex], subtasks: activeSubs };
                    return newItems;
                });

                const timer = setTimeout(() => {
                    // Mark subtask done
                    setItems(prev => {
                        const newItems = [...prev];
                        const activeSubs = [...newItems[currentItemIndex].subtasks];
                        activeSubs[currentSubtaskIndex] = { ...activeSubs[currentSubtaskIndex], status: 'done' };
                        newItems[currentItemIndex] = { ...newItems[currentItemIndex], subtasks: activeSubs };
                        return newItems;
                    });
                    setCurrentSubtaskIndex(prev => prev + 1);
                }, activeSub.duration / speed);

                return () => clearTimeout(timer);
            }

            // --- SUBTASK COMPLETION / TASK ADVANCE ---
            else if (hasSubtasks && currentSubtaskIndex >= subtasks.length) {
                // All subtasks done, finish main task
                setItems(prev => {
                    const newItems = [...prev];
                    newItems[currentItemIndex] = { ...newItems[currentItemIndex], status: 'done' };
                    return newItems;
                });

                setCurrentItemIndex(prev => prev + 1);
                setCurrentSubtaskIndex(-1);
            }

            // --- TASK INITIATION ---
            else if (currentSubtaskIndex === -1) {
                // Activate Task
                setItems(prev => {
                    const newItems = [...prev];
                    if (newItems[currentItemIndex].status === 'active') return newItems;
                    newItems[currentItemIndex] = { ...newItems[currentItemIndex], status: 'active' };
                    return newItems;
                });

                if (hasSubtasks) {
                    // Start subtasks immediately
                    setCurrentSubtaskIndex(0);
                } else {
                    // No subtasks, wait duration then finish
                    const timer = setTimeout(() => {
                        setItems(prev => {
                            const newItems = [...prev];
                            newItems[currentItemIndex] = { ...newItems[currentItemIndex], status: 'done' };
                            return newItems;
                        });
                        setCurrentItemIndex(prev => prev + 1);
                    }, currentItem.duration / speed);
                    return () => clearTimeout(timer);
                }
            }
        }

    }, [stage, currentItemIndex, currentSubtaskIndex, items.length, speed]);

    // Unified scroll effect that is less aggressive
    useEffect(() => {
        if (stage === 'executing') {
            const timeoutId = setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 50);
            return () => clearTimeout(timeoutId);
        }
        if (stage === 'done') {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [items, stage, currentItemIndex, currentSubtaskIndex]);

    if (!plan) return null;

    // Render icons
    const renderStatusIcon = (status, size = 'normal') => {
        const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';

        if (status === 'done') {
            return (
                <svg className={sizeClass} style={{ color: 'var(--accent-primary)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
            );
        } else if (status === 'active') {
            return (
                <svg className={`${sizeClass} spinner`} style={{ color: 'var(--accent-primary)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            );
        } else {
            return <div className={`${sizeClass} rounded-full border-2`} style={{ borderColor: 'var(--border-color)' }}></div>;
        }
    };

    // Render thought item
    const renderThought = (item) => (
        <div key={item.id} className="flex items-start gap-3 fade-in py-1">
            <div className="mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center">
                <svg className="w-4 h-4" style={{ color: 'var(--text-dim)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
            </div>
            <div className={`italic ${item.status === 'done' ? 'opacity-70' : ''}`} style={{ color: 'var(--text-secondary)' }}>
                {item.status === 'active' && <span className="typing-cursor">{item.text}</span>}
                {item.status !== 'active' && item.text}
            </div>
        </div>
    );

    // Render planning item
    const renderPlanning = (item) => (
        <div key={item.id} className="flex items-start gap-3 fade-in py-1">
            <div className="mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center">
                <svg className="w-4 h-4" style={{ color: 'var(--accent-warm)' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
            </div>
            <div className={`font-medium ${item.status === 'done' ? 'opacity-70' : ''}`} style={{ color: 'var(--text-primary)' }}>
                {item.text}
            </div>
        </div>
    );

    // Render task item
    const renderTask = (item) => (
        <div key={item.id} className="fade-in">
            {/* Main Task Item */}
            <div className="flex items-start gap-3 py-1">
                <div className="mt-0.5 shrink-0">
                    {renderStatusIcon(item.status)}
                </div>
                <div className={item.status === 'done' ? 'opacity-70' : ''} style={{ color: 'var(--text-primary)' }}>
                    {item.text}
                </div>
            </div>

            {/* Nested Subtasks */}
            {item.subtasks && item.subtasks.length > 0 && (
                <div className="ml-8 mt-2 flex flex-col gap-2 border-l-2 pl-4" style={{ borderColor: 'var(--border-color)' }}>
                    {item.subtasks.map((sub) => {
                        const subVisible = sub.status === 'active' || sub.status === 'done' || item.status === 'done';
                        if (!subVisible) return null;

                        return (
                            <div key={sub.id} className="flex items-center gap-2 text-xs fade-in" style={{ color: sub.status === 'done' ? 'var(--text-dim)' : 'var(--text-secondary)' }}>
                                {renderStatusIcon(sub.status, 'small')}
                                {sub.text}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col gap-3 text-sm" style={{ color: 'var(--text-primary)' }}>
            {/* Initial Thinking Block */}
            {stage === 'thinking' && (
                <div className="flex items-center gap-2 fade-in">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full gentle-pulse" style={{ backgroundColor: style === 'monkeys_paw' ? '#a855f7' : style === 'incompetent' ? '#ef4444' : 'var(--accent-primary)' }}></span>
                        <span className="w-2 h-2 rounded-full gentle-pulse" style={{ backgroundColor: style === 'monkeys_paw' ? '#a855f7' : style === 'incompetent' ? '#ef4444' : 'var(--accent-primary)', animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 rounded-full gentle-pulse" style={{ backgroundColor: style === 'monkeys_paw' ? '#a855f7' : style === 'incompetent' ? '#ef4444' : 'var(--accent-primary)', animationDelay: '0.4s' }}></span>
                    </div>
                    <span style={{ color: 'var(--text-dim)' }}>{style === 'monkeys_paw' ? 'Communing with the void...' : style === 'incompetent' ? 'Uh... thinking... kind of...' : 'Thinking...'}</span>
                </div>
            )}

            {/* Execution - Render all visible items */}
            {(stage === 'executing' || stage === 'done') && (
                <div className="flex flex-col gap-2">
                    {items.map((item) => {
                        const isVisible = item.status === 'active' || item.status === 'done';
                        if (!isVisible) return null;

                        if (item.type === 'thought') return renderThought(item);
                        if (item.type === 'planning') return renderPlanning(item);
                        if (item.type === 'task') return renderTask(item);

                        // Fallback for legacy format (no type)
                        return renderTask({ ...item, type: 'task' });
                    })}
                    <div ref={bottomRef} />
                </div>
            )}

            {/* Completion Badge */}
            {stage === 'done' && (
                <div className="mt-4 pt-4 border-t flex items-center gap-2 fade-in" style={{ borderColor: 'var(--border-color)' }}>
                    {style === 'monkeys_paw' ? (
                        <>
                            <svg className="w-5 h-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" />
                            </svg>
                            <span className="font-medium text-purple-500 italic">The wish is fulfilled. Fear the consequences.</span>
                        </>
                    ) : style === 'incompetent' ? (
                        <>
                            <svg className="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium text-red-500">Task failed. I'm so sorry. I tried my best.</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                            <span style={{ color: 'var(--accent-primary)' }} className="font-medium">Task completed successfully</span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AgentResponse;
