
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Predictor from './components/Predictor';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
               <span className="text-xl">🔥</span>
             </div>
             <span className="hidden md:block font-bold text-xl tracking-tight">IgnisGuard</span>
           </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {[
            { id: AppTab.DASHBOARD, icon: '📊', label: 'Dashboard' },
            { id: AppTab.PREDICTOR, icon: '🛡️', label: 'Predictor' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="hidden md:block font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="hidden md:block p-4 bg-slate-950/50 rounded-xl border border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Node Status</p>
            <p className="text-xs text-emerald-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Synchronized
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold capitalize">
              {activeTab === AppTab.DASHBOARD ? 'Global Overview' : 'Fire Prediction Analysis'}
            </h1>
            <p className="text-xs text-slate-500">Real-time environmental surveillance system</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end">
               <span className="text-xs font-medium">Sat-Nav System v4.2</span>
               <span className="text-[10px] text-slate-500">Last Sync: Just now</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto">
          {activeTab === AppTab.DASHBOARD && <Dashboard />}
          {activeTab === AppTab.PREDICTOR && <Predictor />}
        </div>

        <footer className="p-8 border-t border-slate-900 text-center">
          <p className="text-xs text-slate-600">
            &copy; 2024 IgnisGuard AI. Utilizing Gemini-3 Pro & Flash for global environmental safety.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
