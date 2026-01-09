
import React, { useEffect, useState } from 'react';
import RiskMap from './RiskMap';
import { getLatestWildfireNews } from '../services/geminiService';
import { GlobalNewsData } from '../types';

const Dashboard: React.FC = () => {
  const [newsData, setNewsData] = useState<GlobalNewsData | null>(null);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getLatestWildfireNews();
        setNewsData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h4 className="text-slate-500 text-sm font-medium mb-1">Active Alerts</h4>
          <div className="text-3xl font-bold text-orange-500">14</div>
          <div className="text-xs text-slate-500 mt-2">↑ 2 since last 24h</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h4 className="text-slate-500 text-sm font-medium mb-1">High Risk Zones</h4>
          <div className="text-3xl font-bold text-red-500">8</div>
          <div className="text-xs text-slate-500 mt-2">Critical humidity levels detected</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h4 className="text-slate-500 text-sm font-medium mb-1">Response Time</h4>
          <div className="text-3xl font-bold text-emerald-500">12m</div>
          <div className="text-xs text-slate-500 mt-2">Average deployment speed</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h4 className="text-slate-500 text-sm font-medium mb-1">Prediction Confidence</h4>
          <div className="text-3xl font-bold text-slate-200">94.2%</div>
          <div className="text-xs text-slate-500 mt-2">Based on Gemini-3 Flash analysis</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskMap />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
               🌐 Global Fire News
               <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded uppercase tracking-wider text-slate-400">Real-time</span>
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {loadingNews ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex gap-4 p-2">
                       <div className="h-10 w-10 bg-slate-800 rounded"></div>
                       <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                       </div>
                    </div>
                  ))}
                </div>
              ) : !newsData || newsData.fires.length === 0 ? (
                 <p className="text-slate-500 text-sm p-2">No active fire data currently available via search.</p>
              ) : (
                <div className="flex flex-col gap-4">
                    {/* News Summary Section */}
                    <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                      <h4 className="text-sm font-bold text-orange-400 mb-2 leading-tight">
                        {newsData.headline}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {newsData.summary}
                      </p>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="py-2 px-1 font-medium pb-3">Fire Name</th>
                                    <th className="py-2 px-1 font-medium pb-3">Location</th>
                                    <th className="py-2 px-1 font-medium pb-3 text-right">Size</th>
                                    <th className="py-2 px-1 font-medium pb-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-800/50">
                                {newsData.fires.map((item, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-1 font-medium text-slate-200">
                                            {item.fireName}
                                        </td>
                                        <td className="py-3 px-1 text-slate-400 text-xs">
                                            {item.location}
                                        </td>
                                        <td className="py-3 px-1 text-slate-400 text-xs text-right whitespace-nowrap">
                                            {item.size}
                                        </td>
                                        <td className="py-3 px-1 text-right">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap ${
                                                item.status.toLowerCase().includes('contain') || item.status.toLowerCase().includes('held') ? 'bg-emerald-500/10 text-emerald-400' :
                                                item.status.toLowerCase().includes('control') ? 'bg-blue-500/10 text-blue-400' :
                                                'bg-orange-500/10 text-orange-400'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
              )}
            </div>
            <div className="mt-6 p-4 bg-slate-950 rounded-xl border border-slate-800">
               <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">System Status</div>
               <div className="flex items-center gap-2 text-xs text-emerald-500">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 All models operational
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
