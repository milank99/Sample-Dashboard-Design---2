
import React, { useState, useEffect, useMemo } from 'react';
import { Utility, UtilityType } from './types';
import { fetchUtilities } from './services/csvParser';
import UtilityCard from './components/UtilityCard';
import { Search, Loader2, Database, Sparkles, FilterX } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<Utility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const utilities = await fetchUtilities();
      setData(utilities);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const aiSubsystems = useMemo(() => filteredData.filter(i => i.type === 'AI'), [filteredData]);
  const analyticsOps = useMemo(() => filteredData.filter(i => i.type === 'Analytics'), [filteredData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading EngOps Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">
            By IMTest Automation Team
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          EngOps <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">—</span> AI & Analytics
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto mb-10 text-lg">
          Central intelligence hub for software engineering operations and subsystem monitoring.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search systems, dashboards, or tools..."
            className="block w-full pl-14 pr-4 py-4 md:py-5 bg-white border-2 border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* AI Subsystems Column */}
          <section className={`transition-all duration-300 ${aiSubsystems.length === 0 ? 'opacity-40 grayscale pointer-events-none hidden lg:block' : ''}`}>
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
              <div className="p-2 bg-violet-50 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">AI Subsystems</h2>
              <span className="ml-auto text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                {aiSubsystems.length} Tools
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {aiSubsystems.map((item, idx) => (
                <UtilityCard key={`ai-${idx}`} utility={item} />
              ))}
              {aiSubsystems.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-400 italic">No AI matching results</p>
                </div>
              )}
            </div>
          </section>

          {/* Analytics Column */}
          <section className={`transition-all duration-300 ${analyticsOps.length === 0 ? 'opacity-40 grayscale pointer-events-none hidden lg:block' : ''}`}>
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
              <div className="p-2 bg-teal-50 rounded-lg">
                <Database className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Analytics & Ops</h2>
              <span className="ml-auto text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                {analyticsOps.length} Tools
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {analyticsOps.map((item, idx) => (
                <UtilityCard key={`analytics-${idx}`} utility={item} />
              ))}
              {analyticsOps.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-400 italic">No Analytics matching results</p>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Global Empty State */}
        {filteredData.length === 0 && (
          <div className="mt-20 text-center animate-in fade-in duration-500">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <FilterX className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No utilities found</h3>
            <p className="text-slate-500">Try adjusting your search terms to find what you're looking for.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-100 pt-10 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} IMTest Automation Platform. Internal Use Only.
      </footer>
    </div>
  );
};

export default App;
