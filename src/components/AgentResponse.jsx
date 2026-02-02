
import React, { useState, useEffect } from 'react';

const AgentResponse = ({ plan, onComplete }) => {
    const [stage, setStage] = useState('thinking'); // thinking, planning, executing, done
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        if (plan) {
            setSteps(plan);
            setStage('thinking');

            // Simulate thinking time
            setTimeout(() => {
                setStage('planning');
                setTimeout(() => {
                    setStage('executing');
                }, 1500);
            }, 2000);
        }
    }, [plan]);

    useEffect(() => {
        if (stage === 'executing' && currentStepIndex < steps.length) {
            const currentStep = steps[currentStepIndex];

            // Mark current as active
            setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { ...s, status: 'active' } : s));

            const timer = setTimeout(() => {
                // Mark current as done
                setSteps(prev => prev.map((s, i) => i === currentStepIndex ? { ...s, status: 'done' } : s));
                setCurrentStepIndex(prev => prev + 1);
            }, currentStep.duration);

            return () => clearTimeout(timer);
        } else if (stage === 'executing' && currentStepIndex >= steps.length) {
            setStage('done');
            if (onComplete) onComplete();
        }
    }, [stage, currentStepIndex, steps.length]);

    if (!plan) return null;

    return (
        <div className="flex flex-col gap-4 max-w-2xl w-full mx-auto my-6 text-sm">
            {/* Thinking Block */}
            <div className={`border border-gray-800 bg-gray-900/40 rounded p-3 transition-all duration-300 ${stage === 'thinking' ? 'animate-pulse' : ''}`}>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <span className="text-xs uppercase tracking-wider font-bold">Thought Process</span>
                    {stage === 'thinking' && <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />}
                </div>
                <div className="text-gray-300 font-mono text-xs">
                    {stage === 'thinking' ? "Analyzing request vectors... Simulating outcomes... Drafting accomplice protocols..." : "Analysis complete. Optimization potential: Critical. Strategy mapped."}
                </div>
            </div>

            {/* Plan & Execution */}
            {(stage === 'planning' || stage === 'executing' || stage === 'done') && (
                <div className="border border-gray-800 bg-black/80 rounded p-4 shadow-2xl relative overflow-hidden">
                    <div className="scanline"></div>
                    <h3 className="text-accent mb-4 font-mono text-lg flex items-center gap-2">
                        <span className="text-gray-600">&gt;&gt;</span> OPERATION MANIFEST
                    </h3>

                    <div className="flex flex-col gap-3">
                        {steps.map((step, idx) => (
                            <div key={step.id} className={`flex items-start gap-3 p-2 rounded border border-transparent transition-all duration-300 ${step.status === 'active' ? 'bg-gray-900 border-gray-700' :
                                step.status === 'done' ? 'opacity-50' : 'opacity-30'
                                }`}>
                                <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${step.status === 'done' ? 'border-green-500 bg-green-500/20' :
                                    step.status === 'active' ? 'border-cyan-500 animate-spin border-t-transparent' :
                                        'border-gray-600'
                                    }`}>
                                    {step.status === 'done' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                                </div>
                                <div className={`font-mono ${step.status === 'active' ? 'text-cyan-400' :
                                    step.status === 'done' ? 'text-green-400 line-through' :
                                        'text-gray-500'
                                    }`}>
                                    {step.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {stage === 'done' && (
                        <div className="mt-6 p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-center font-bold tracking-widest animate-pulse">
                            MISSION ACCOMPLISHED / ASSETS SECURED
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AgentResponse;
