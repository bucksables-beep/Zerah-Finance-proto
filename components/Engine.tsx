
import React, { useState } from 'react';

interface EngineProps {
  onBack: () => void;
}

const Engine: React.FC<EngineProps> = ({ onBack }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [showActivation, setShowActivation] = useState(false);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payroll' | 'hedging'>('invoices');

  const handleActivate = () => {
    setShowActivation(true);
    setTimeout(() => {
      setIsPremium(true);
      setShowActivation(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-full pb-32 animate-in fade-in duration-500 relative">
      {/* Background glow for Engine aesthetic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="px-6 py-8 flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Zerah Engine 
            {isPremium && <span className="text-[10px] bg-primary text-background-dark px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Pro</span>}
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">High-performance business tools</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isPremium ? 'bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(183,204,22,0.3)]' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}>
          <span className="material-icons-round">{isPremium ? 'bolt' : 'settings'}</span>
        </div>
      </header>

      {!isPremium ? (
        <section className="px-6 mb-10 relative z-10">
          <div className="bg-gradient-to-br from-surface-dark to-background-dark p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-icons-round text-8xl rotate-12">rocket_launch</span>
            </div>
            
            <h2 className="text-2xl font-black mb-2 text-white">Power Up Your Business</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Unlock the full potential of Zerah with our Pro Engine. Automate payroll, manage international invoices, and lock-in exchange rates.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                { icon: 'description', label: 'Smart Global Invoicing' },
                { icon: 'groups', label: 'Multi-currency Team Payroll' },
                { icon: 'trending_down', label: 'FX Risk Hedging & Rate Lock' }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="material-icons-round text-primary text-sm">{item.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-200">{item.label}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={handleActivate}
              className="w-full bg-primary text-background-dark py-5 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20 uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span>Activate Engine Pro</span>
              <span className="material-icons-round">bolt</span>
            </button>
            <p className="text-center mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Starting from $49.99/month</p>
          </div>
        </section>
      ) : (
        <>
          {/* Active Pro UI */}
          <section className="px-6 mb-8">
            <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-[24px]">
              {[
                { id: 'invoices', icon: 'description', label: 'Invoices' },
                { id: 'payroll', icon: 'groups', label: 'Payroll' },
                { id: 'hedging', icon: 'trending_down', label: 'Hedging' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="material-icons-round text-sm">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </section>

          <main className="px-6 flex-1 relative z-10">
            {activeTab === 'invoices' && (
              <div className="animate-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="text-lg font-black">Outstanding Invoices</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global receivables</p>
                  </div>
                  <button className="bg-primary/10 text-primary p-3 rounded-2xl border border-primary/20 active:scale-90 transition-transform">
                    <span className="material-icons-round">add</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'INV-001', client: 'Acme Corp', amount: '$4,200.00', status: 'Pending', color: 'text-amber-500' },
                    { id: 'INV-002', client: 'Stark Ind.', amount: '€1,850.50', status: 'Paid', color: 'text-primary' },
                    { id: 'INV-003', client: 'Wayne Ent.', amount: '£3,000.00', status: 'Overdue', color: 'text-red-500' }
                  ].map((inv) => (
                    <div key={inv.id} className="bg-white dark:bg-surface-dark p-5 rounded-[28px] border border-slate-200 dark:border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                          <span className="material-icons-round">description</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">{inv.client}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{inv.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm">{inv.amount}</p>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${inv.color}`}>{inv.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payroll' && (
              <div className="animate-in slide-in-from-right-4 duration-500">
                <div className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-slate-200 dark:border-white/5 mb-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Next Pay Cycle</p>
                   <div className="flex justify-between items-end mb-4">
                      <h4 className="text-3xl font-black">Oct 31, 2024</h4>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Payroll</p>
                         <p className="text-xl font-black text-primary">$12,450.00</p>
                      </div>
                   </div>
                   <button className="w-full bg-primary text-background-dark py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/10 active:scale-95 transition-all">
                      Run Global Payroll
                   </button>
                </div>

                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Team Members (12)</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Miller', role: 'Dev Lead', wallet: 'USD', amount: '4,500' },
                    { name: 'Jan Klaus', role: 'UI Designer', wallet: 'EUR', amount: '3,200' },
                    { name: 'Lekan Ade', role: 'Content', wallet: 'NGN', amount: '800k' }
                  ].map((person, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-[24px]">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs border border-primary/20">
                            {person.name[0]}
                          </div>
                          <div>
                             <p className="text-sm font-bold">{person.name}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{person.role}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black">{person.amount} {person.wallet}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hedging' && (
              <div className="animate-in slide-in-from-right-4 duration-500">
                <div className="bg-background-dark p-6 rounded-[32px] border border-primary/20 mb-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                      <span className="material-icons-round text-6xl">shield</span>
                   </div>
                   <h4 className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-4">FX Rate Protection</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-slate-400 text-xs">Locked Pair</span>
                         <span className="font-black text-white">USD / EUR</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-slate-400 text-xs">Guaranteed Rate</span>
                         <span className="font-black text-primary">0.9234</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-slate-400 text-xs">Contract Value</span>
                         <span className="font-black text-white">$50,000.00</span>
                      </div>
                   </div>
                   <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Expires in 14 days</span>
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest underline">Release Contract</button>
                   </div>
                </div>

                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 p-8 rounded-[40px] text-center">
                   <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-[24px] flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-300 dark:border-white/10">
                      <span className="material-icons-round text-slate-400">add_moderator</span>
                   </div>
                   <h5 className="font-black text-lg mb-2">New Rate Lock</h5>
                   <p className="text-slate-500 text-xs mb-6 px-4">Protect your upcoming large transfers against currency volatility by locking in today's rate.</p>
                   <button className="w-full bg-white dark:bg-white/5 border-2 border-primary text-primary py-4 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all">
                      Lock Current Rate
                   </button>
                </div>
              </div>
            )}
          </main>
        </>
      )}

      {/* Activation Modal Overlay */}
      {showActivation && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-background-dark/95 backdrop-blur-xl animate-in fade-in duration-500"></div>
           <div className="relative z-10 flex flex-col items-center text-center animate-in zoom-in duration-500">
              <div className="relative w-32 h-32 mb-10">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                  <div className="absolute inset-4 rounded-full border-4 border-white/5 border-b-primary/40 animate-spin-slow"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-icons-round text-primary text-5xl">bolt</span>
                  </div>
              </div>
              <h2 className="text-3xl font-black mb-4 uppercase tracking-[0.2em] text-white">Igniting Engine</h2>
              <p className="text-slate-400 text-sm max-w-[260px]">Verifying credentials and preparing your business environment...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Engine;
