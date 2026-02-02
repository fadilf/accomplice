
import React, { useEffect, useState } from 'react';

const Dashboard = ({ active }) => {
    const [metrics, setMetrics] = useState({
        cpu: 12,
        net: 0.5,
        value: 0,
        risk: 2
    });

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (!active) return;

        const interval = setInterval(() => {
            setMetrics(prev => ({
                cpu: Math.min(100, Math.max(10, prev.cpu + (Math.random() * 20 - 10))),
                net: Math.max(0, prev.net + (Math.random() * 5 - 2)),
                value: prev.value + Math.floor(Math.random() * 1000),
                risk: Math.min(100, Math.max(0, prev.risk + (Math.random() * 5 - 2)))
            }));

            if (Math.random() > 0.7) {
                const newLog = `[${new Date().toLocaleTimeString()}] ${["PACKET_INJECT", "ROUTE_HOP", "KEY_EXCHANGE", "NONCE_VERIFY"][Math.floor(Math.random() * 4)]} :: ${Math.floor(Math.random() * 9999)}`;
                setLogs(prev => [newLog, ...prev].slice(0, 10));
            }
        }, 800);

        return () => clearInterval(interval);
    }, [active]);

    return (
        <div className="dashboard-panel p-4 border-l border-gray-800 bg-black h-full flex flex-col font-mono text-xs w-80 fixed right-0 top-0 bottom-0 z-50 transition-transform duration-500"
            style={{ transform: active ? 'translateX(0)' : 'translateX(100%)' }}>

            <div className="mb-6">
                <h3 className="text-accent text-sm mb-2 border-b border-gray-800 pb-1">SYSTEM STATUS</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Metric label="CPU LOAD" value={metrics.cpu.toFixed(1)} unit="%" color="var(--accent-primary)" />
                    <Metric label="NET FLUX" value={metrics.net.toFixed(2)} unit="TB/s" color="var(--accent-secondary)" />
                    <Metric label="RISK LVL" value={metrics.risk.toFixed(0)} unit="%" color="var(--accent-alert)" />
                    <Metric label="CAPTURED" value={metrics.value.toLocaleString()} unit="$" color="var(--accent-warn)" />
                </div>
            </div>

            <div className="mb-6 flex-grow">
                <h3 className="text-dim text-sm mb-2 border-b border-gray-800 pb-1">TRACE LOG</h3>
                <div className="flex flex-col gap-1 overflow-hidden opacity-80">
                    {logs.map((log, i) => (
                        <div key={i} className="text-green-500/80 truncate">{log}</div>
                    ))}
                </div>
            </div>

            <div className="h-32 border border-gray-800 relative bg-gray-900/50 overflow-hidden">
                {/* Fake Graph */}
                <div className="absolute inset-0 flex items-end justify-between px-1">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2 bg-green-500/50 transition-all duration-300"
                            style={{ height: `${Math.random() * 100}%` }}
                        />
                    ))}
                </div>
                <div className="absolute top-2 left-2 text-green-500 text-[10px]">NETWORK ACTIVITY</div>
            </div>
        </div>
    );
};

const Metric = ({ label, value, unit, color }) => (
    <div className="flex flex-col">
        <span className="text-gray-500 text-[10px]">{label}</span>
        <span className="text-lg font-bold" style={{ color }}>{value}<span className="text-xs text-gray-600 ml-1">{unit}</span></span>
    </div>
);

export default Dashboard;
