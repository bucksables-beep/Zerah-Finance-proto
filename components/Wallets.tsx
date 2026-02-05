
import React, { useState } from 'react';
import { Wallet } from '../types';
import { AVAILABLE_CURRENCIES } from '../constants';

interface WalletsProps {
  wallets: Wallet[];
  onAddWallet: (wallet: Wallet) => void;
  onNavigateToReceive: (wallet: Wallet) => void;
  onNavigateToSend: (wallet: Wallet) => void;
}

const Wallets: React.FC<WalletsProps> = ({ wallets, onAddWallet, onNavigateToReceive, onNavigateToSend }) => {
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);

  const totalBalanceUSD = wallets.reduce((acc, w) => {
    // Mock conversion rates for display purposes
    const rates: Record<string, number> = { 
      'USD': 1, 
      'EUR': 1.08, 
      'GBP': 1.27, 
      'NGN': 0.00062,
      'AUD': 0.65,
      'CNY': 0.14
    };
    return acc + (w.balance * (rates[w.currency] || 1));
  }, 0);

  const handleAddNewWallet = (currency: typeof AVAILABLE_CURRENCIES[0]) => {
    const newWallet: Wallet = {
      ...currency,
      balance: 0,
      color: 'bg-white dark:bg-surface-dark'
    };
    onAddWallet(newWallet);
    setShowAddWalletModal(false);
  };

  const currenciesToAdd = AVAILABLE_CURRENCIES.filter(
    c => !wallets.some(w => w.currency === c.currency)
  );

  return (
    <div className="flex flex-col min-h-full pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-6 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">My Wallets</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Manage your assets</p>
        </div>
        <button 
          onClick={() => setShowAddWalletModal(true)}
          className="w-12 h-12 rounded-2xl bg-primary text-background-dark flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-transform"
        >
          <span className="material-icons-round">add</span>
        </button>
      </header>

      {/* Net Worth Summary Card */}
      <section className="px-6 mb-8">
        <div className="bg-background-dark text-white p-8 rounded-[40px] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <span className="material-icons-round text-8xl">account_balance</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Total Estimated Balance</p>
          <h2 className="text-4xl font-black tracking-tighter mb-4">
            ${totalBalanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Live conversion from all wallets</span>
          </div>
        </div>
      </section>

      {/* Wallet List */}
      <section className="px-6 space-y-4">
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Your Portfolios</h3>
          <span className="text-[10px] font-bold text-slate-400">{wallets.length} active</span>
        </div>
        
        {wallets.map((wallet) => (
          <div 
            key={wallet.currency}
            className="group relative bg-white dark:bg-surface-dark/40 border border-slate-200 dark:border-white/5 rounded-[32px] p-5 transition-all hover:bg-slate-50 dark:hover:bg-surface-dark/60 active:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/10">
                  <img src={wallet.flagUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-lg">{wallet.currency}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{wallet.label}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black">{wallet.symbol}{wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Available</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => onNavigateToReceive(wallet)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                <span className="material-icons-round text-sm">account_balance</span>
                <span>Deposit</span>
              </button>
              <button 
                onClick={() => onNavigateToSend(wallet)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                <span className="material-icons-round text-sm">send</span>
                <span>Send</span>
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setShowAddWalletModal(true)}
          className="w-full py-6 rounded-[32px] border-2 border-dashed border-slate-300 dark:border-white/10 flex items-center justify-center gap-3 text-slate-400 hover:text-primary hover:border-primary transition-all group"
        >
          <span className="material-icons-round group-hover:rotate-90 transition-transform">add</span>
          <span className="text-sm font-black uppercase tracking-widest">Open New Wallet</span>
        </button>
      </section>

      {/* Add Wallet Modal */}
      {showAddWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm animate-in fade-in" onClick={() => setShowAddWalletModal(false)}></div>
          <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[40px] p-6 relative z-10 animate-in slide-in-from-bottom-20 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Add New Currency Wallet</h3>
              <button onClick={() => setShowAddWalletModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full">
                <span className="material-icons-round text-slate-400">close</span>
              </button>
            </div>
            <div className="space-y-3">
              {currenciesToAdd.length > 0 ? currenciesToAdd.map((c) => (
                <button
                  key={c.currency}
                  onClick={() => handleAddNewWallet(c)}
                  className="w-full flex items-center justify-between p-4 rounded-[24px] bg-slate-50 dark:bg-white/5 border-2 border-transparent hover:border-primary transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border border-white/10">
                      <img src={c.flagUrl} alt={c.currency} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">{c.currency}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{c.label}</p>
                    </div>
                  </div>
                  <span className="material-icons-round text-primary">add_circle_outline</span>
                </button>
              )) : (
                <div className="py-10 text-center text-slate-500">
                  <p className="font-bold">All available wallets are active</p>
                  <p className="text-xs">More currencies coming soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallets;
