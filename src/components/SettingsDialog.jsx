
import React from 'react';

const SettingsDialog = ({ open, onClose, settings, onUpdateSettings }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(6, 9, 14, 0.7)', backdropFilter: 'blur(6px)' }}
                onClick={onClose}
            ></div>

            {/* Dialog */}
            <div
                className="relative w-full max-w-md rounded-2xl p-6 dialog-surface"
            >
                <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
                    <h2 className="text-lg font-semibold font-display" style={{ color: 'var(--text-primary)' }}>
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded icon-button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                            Response Style
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={() => onUpdateSettings({ ...settings, style: 'absurd' })}
                                className={`p-3 rounded-xl text-left flex items-center gap-3 settings-option ${settings.style === 'absurd' ? 'is-active' : ''}`}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: 'rgba(77, 212, 181, 0.18)' }}>
                                    🎭
                                </div>
                                <div>
                                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Absurd</div>
                                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Chaotic and comedic responses</div>
                                </div>
                            </button>

                            <button
                                onClick={() => onUpdateSettings({ ...settings, style: 'grounded' })}
                                className={`p-3 rounded-xl text-left flex items-center gap-3 settings-option ${settings.style === 'grounded' ? 'is-active' : ''}`}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>
                                    💼
                                </div>
                                <div>
                                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Grounded</div>
                                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Professional and realistic</div>
                                </div>
                            </button>

                            <button
                                onClick={() => onUpdateSettings({ ...settings, style: 'evil_genius' })}
                                className={`p-3 rounded-xl text-left flex items-center gap-3 settings-option ${settings.style === 'evil_genius' ? 'is-active' : ''}`}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: 'rgba(239,68,68,0.2)' }}>
                                    🦹
                                </div>
                                <div>
                                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Evil Genius</div>
                                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Villainous but creative</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Execution Speed */}
                    <div>
                        <label className="block text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                            Execution Speed
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="4"
                                step="1"
                                value={[0.25, 0.5, 1, 2, 3].indexOf(settings.speed || 1)}
                                onChange={(e) => {
                                    const speeds = [0.25, 0.5, 1, 2, 3];
                                    onUpdateSettings({ ...settings, speed: speeds[parseInt(e.target.value)] });
                                }}
                                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                                style={{
                                    backgroundColor: 'rgba(21, 28, 40, 0.9)',
                                    accentColor: 'var(--accent-primary)'
                                }}
                            />
                            <span className="text-sm font-medium w-12 text-right" style={{ color: 'var(--text-primary)' }}>
                                {settings.speed || 1}x
                            </span>
                        </div>
                        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
                            <span>Slower</span>
                            <span>Faster</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md font-medium text-sm transition-colors"
                        style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-strong))', color: '#0b1016' }}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsDialog;
