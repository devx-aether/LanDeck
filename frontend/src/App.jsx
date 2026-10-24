import React, { useState, useEffect } from 'react';
import { Server, Activity } from 'lucide-react';

function App() {
  const [stats, setStats] = useState({ 
    cpu_percent: 0, 
    ram_percent: 0, 
    uptime_seconds: 0,
    os: 'Loading...',
    status: 'connecting...' 
  });
  const [containers, setContainers] = useState([]);

  // Helper function to format seconds into a readable string
  const formatUptime = (seconds) => {
    if (!seconds) return '0h 0m';
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    
    if (d > 0) return `${d}d ${h}h`;
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const sysRes = await fetch('http://127.0.0.1:8008/api/system/stats');
        const sysData = await sysRes.json();
        setStats(sysData);

        const docRes = await fetch('http://127.0.0.1:8008/api/docker/status');
        const docData = await docRes.json();
        if (docData.containers) {
          setContainers(docData.containers);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats(prev => ({ ...prev, status: 'offline' }));
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 p-4 md:p-8 font-sans">
      
      {/* Header */}
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Server size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">LanDeck</h1>
            <p className="text-xs text-zinc-500">Live Telemetry</p>
          </div>
        </div>
        
        {/* Status Dot */}
        <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full">
          <span className={`w-2 h-2 rounded-full ${stats.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-xs font-mono text-zinc-400 uppercase">{stats.status}</span>
        </div>
      </header>

      {/* Bento Grid */}
      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Host Telemetry Card */}
        <div className="col-span-1 md:col-span-2 bg-zinc-900/40 border border-white/5 rounded-3xl p-5 backdrop-blur-md">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-zinc-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Host Engine</span>
            </div>
            
            {/* New Uptime and OS Badges */}
            <div className="flex gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700/50 hidden sm:inline-block">
                {stats.os}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                UPTIME: {formatUptime(stats.uptime_seconds)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* CPU Progress Bar */}
            <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-2xl p-3">
              <span className="text-xs text-zinc-400">CPU Usage</span>
              <div className="mt-2 text-2xl font-bold font-mono">{stats.cpu_percent}%</div>
              <div className="w-full bg-zinc-700/40 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${stats.cpu_percent}%` }}></div>
              </div>
            </div>

            {/* RAM Progress Bar */}
            <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-2xl p-3">
              <span className="text-xs text-zinc-400">Memory</span>
              <div className="mt-2 text-2xl font-bold font-mono">{stats.ram_percent}%</div>
              <div className="w-full bg-zinc-700/40 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${stats.ram_percent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Docker Services Card */}
        <div className="col-span-1 md:col-span-2 bg-zinc-900/40 border border-white/5 rounded-3xl p-5 backdrop-blur-md">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-zinc-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Container Fleet</span>
            </div>
          </div>

          <div className="space-y-2">
            {containers.length === 0 ? (
              <div className="text-sm text-zinc-500 py-4 text-center border border-dashed border-zinc-700/50 rounded-2xl">
                No containers found
              </div>
            ) : (
              containers.map(container => (
                <div key={container.id} className="flex items-center justify-between bg-zinc-800/40 border border-zinc-700/30 rounded-2xl p-3">
                  <span className="text-sm font-medium text-zinc-200 capitalize">{container.name}</span>
                  
                  <div className="flex gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${container.status === 'running' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                      {container.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;