
import React from 'react';

const SettingsDialog = ({ open, onClose, settings, onUpdateSettings }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                onClick={onClose}
            ></div>

            {/* Dialog */}
            <div
                className="relative w-full max-w-md rounded-lg shadow-2xl p-6"
                style={{ backgroundColor: '#202123' }}
            >
                <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'rgba(86,88,105,0.5)' }}>
                    <h2 className="text-lg font-semibold" style={{ color: '#ececf1' }}>
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                        style={{ color: '#8e8ea0' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm mb-3" style={{ color: '#c5c5d2' }}>
                            Response Style
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={() => onUpdateSettings({ ...settings, style: 'absurd' })}
                                className="p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3"
                                style={{
                                    backgroundColor: settings.style === 'absurd' ? 'rgba(16,163,127,0.15)' : 'rgba(64,65,79,0.5)',
                                    border: settings.style === 'absurd' ? '1px solid #10a37f' : '1px solid transparent'
                                }}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: 'rgba(16,163,127,0.2)' }}>
                                    🎭
                                </div>
                                <div>
                                    <div className="font-medium text-sm" style={{ color: '#ececf1' }}>Absurd</div>
                                    <div className="text-xs" style={{ color: '#8e8ea0' }}>Chaotic and comedic responses</div>
                                </div>
                            </button>

                            <button
                                onClick={() => onUpdateSettings({ ...settings, style: 'grounded' })}
                                className="p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3"
                                style={{
                                    backgroundColor: settings.style === 'grounded' ? 'rgba(16,163,127,0.15)' : 'rgba(64,65,79,0.5)',
                                    border: settings.style === 'grounded' ? '1px solid #10a37f' : '1px solid transparent'
                                }}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: 'rgba(59,130,246,0.2)' }}>
                                    💼
                                </div>
                                <div>
                                    <div className="font-medium text-sm" style={{ color: '#ececf1' }}>Grounded</div>
                                    <div className="text-xs" style={{ color: '#8e8ea0' }}>Professional and realistic</div>
                                </div>
                            </button>

                            <button
                                onClick={() => onUpdateSettings({ ...settings, style: 'evil_genius' })}
                                className="p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3"
                                style={{
                                    backgroundColor: settings.style === 'evil_genius' ? 'rgba(16,163,127,0.15)' : 'rgba(64,65,79,0.5)',
                                    border: settings.style === 'evil_genius' ? '1px solid #10a37f' : '1px solid transparent'
                                }}
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: 'rgba(239,68,68,0.2)' }}>
                                    🦹
                                </div>
                                <div>
                                    <div className="font-medium text-sm" style={{ color: '#ececf1' }}>Evil Genius</div>
                                    <div className="text-xs" style={{ color: '#8e8ea0' }}>Villainous but creative</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Execution Speed */}
                    <div>
                        <label className="block text-sm mb-3" style={{ color: '#c5c5d2' }}>
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
                                    backgroundColor: 'rgba(64,65,79,0.8)',
                                    accentColor: '#10a37f'
                                }}
                            />
                            <span className="text-sm font-medium w-12 text-right" style={{ color: '#ececf1' }}>
                                {settings.speed || 1}x
                            </span>
                        </div>
                        <div className="flex justify-between text-xs mt-1" style={{ color: '#8e8ea0' }}>
                            <span>Slower</span>
                            <span>Faster</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md font-medium text-sm transition-colors"
                        style={{ backgroundColor: '#10a37f', color: 'white' }}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsDialog;
