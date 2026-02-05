
import React, { useState } from 'react';
import { RECENT_ACTIVITY, AVAILABLE_CURRENCIES } from '../constants';
import { Wallet, Transaction } from '../types';

interface HomeProps {
  wallets: Wallet[];
  onAddWallet: (wallet: Wallet) => void;
  onNavigateToConvert: () => void;
  onNavigateToSend: (wallet?: Wallet) => void;
  onNavigateToReceive: (wallet: Wallet) => void;
  onNavigateToTransaction: (tx: Transaction) => void;
  onNavigateToProfile: () => void;
  onNavigateToNotifications: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  wallets, 
  onAddWallet, 
  onNavigateToConvert, 
  onNavigateToSend,
  onNavigateToReceive,
  onNavigateToTransaction,
  onNavigateToProfile,
  onNavigateToNotifications
}) => {
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);

  const handleWalletClick = (e: React.MouseEvent<HTMLDivElement>, wallet: Wallet) => {
    const target = e.currentTarget;
    
    if (selectedWallet?.currency === wallet.currency) {
      setSelectedWallet(null);
    } else {
      setSelectedWallet(wallet);
      target.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest', 
        inline: 'center' 
      });
    }
  };

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
    <div className="flex flex-col min-h-full pb-24">
      <header className="px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateToProfile}
            className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-surface-dark border border-white/10 active:scale-90 transition-transform shadow-lg shadow-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <img 
              alt="Alex Thompson" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=100&h=100"
            />
          </button>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.15em]">Welcome back,</p>
            <h1 className="text-lg font-bold">Alex Thompson</h1>
          </div>
        </div>
        <button 
          onClick={onNavigateToNotifications}
          className="w-10 h-10 rounded-full bg-slate-200 dark:bg-surface-dark flex items-center justify-center border border-white/5 relative group active:scale-90 transition-transform"
        >
          <span className="material-icons-round text-slate-700 dark:text-white">notifications</span>
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background-light dark:border-background-dark shadow-[0_0_8px_rgba(183,204,22,0.6)]"></span>
        </button>
      </header>

      {/* Wallet Cards Container */}
      <section className="mb-4">
        <div className="flex overflow-x-auto gap-4 px-6 hide-scrollbar py-2">
          {wallets.map((wallet, idx) => {
            const isSelected = selectedWallet?.currency === wallet.currency;
            return (
              <div 
                key={wallet.currency} 
                onClick={(e) => handleWalletClick(e, wallet)}
                className={`min-w-[280px] ${wallet.color} p-6 rounded-[32px] relative overflow-hidden flex flex-col justify-between aspect-[1.6/1] cursor-pointer transition-all duration-500 ease-out ${
                  isSelected 
                    ? 'ring-4 ring-primary ring-offset-4 ring-offset-background-light dark:ring-offset-background-dark scale-[1.04] z-20 shadow-2xl shadow-black/20' 
                    : (idx === 0 ? 'shadow-xl shadow-primary/20 opacity-100' : 'border border-slate-200 dark:border-white/10 opacity-70 scale-95 hover:opacity-100 hover:scale-[0.98]')
                }`}
              >
                {/* Background Flag Watermark */}
                <div className="absolute top-1/2 right-[-20%] transform -translate-y-1/2 w-48 h-32 opacity-[0.08] pointer-events-none rotate-[-15deg]">
                   <img src={wallet.flagUrl} alt="" className="w-full h-full object-cover blur-[2px]" />
                </div>

                <div className="flex justify-between items-start relative z-10">
                  <span className={`text-sm font-semibold ${idx === 0 ? 'text-background-dark/80' : 'text-slate-500 dark:text-slate-400'}`}>
                    {wallet.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {isSelected && <span className="material-icons-round text-background-dark text-sm bg-primary rounded-full p-0.5 animate-in zoom-in-50 duration-300">check</span>}
                    <div className="p-0.5 bg-white/20 rounded-md backdrop-blur-sm border border-white/20">
                      <img alt={wallet.currency} className="w-7 h-5 rounded shadow-sm" src={wallet.flagUrl} />
                    </div>
                  </div>
                </div>
                <div className="relative z-10">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${idx === 0 ? 'text-background-dark/60' : 'text-slate-400 dark:text-slate-500'}`}>
                    Available Balance
                  </p>
                  <h2 className={`text-3xl font-bold ${idx === 0 ? 'text-background-dark' : 'text-slate-900 dark:text-white'}`}>
                    {wallet.symbol}{wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h2>
                </div>
              </div>
            );
          })}
          
          <div 
            onClick={() => setShowAddWalletModal(true)}
            className="min-w-[140px] border-2 border-dashed border-slate-300 dark:border-white/10 rounded-[32px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-colors group p-4"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-background-dark transition-all">
              <span className="material-icons-round">add</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Add Wallet</span>
          </div>
        </div>
      </section>

      {/* Wallet Specific Action Bar (Conditional) */}
      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${selectedWallet ? 'max-h-60 opacity-100 mb-6 translate-y-0' : 'max-h-0 opacity-0 mb-0 -translate-y-4'}`}>
        <div className="px-6 pt-2">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-slate-200 dark:border-white/10 shadow-xl shadow-black/5">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {selectedWallet?.label} Management
                </span>
              </div>
              <button onClick={() => setSelectedWallet(null)} className="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full active:scale-90 transition-transform">
                <span className="material-icons-round text-slate-400 text-xs">close</span>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <button 
                onClick={() => selectedWallet && onNavigateToReceive(selectedWallet)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-full aspect-square rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-white group-active:scale-90 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                  <span className="material-icons-round">account_balance</span>
                </div>
                <span className="text-[9px] font-bold uppercase text-slate-500 tracking-tighter">Receive</span>
              </button>
              <button onClick={onNavigateToConvert} className="flex flex-col items-center gap-2 group">
                <div className="w-full aspect-square rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-active:scale-90 transition-all border border-primary/20 hover:bg-primary/20">
                  <span className="material-icons-round">swap_horiz</span>
                </div>
                <span className="text-[9px] font-bold uppercase text-primary tracking-tighter">Convert</span>
              </button>
              <button onClick={() => onNavigateToSend(selectedWallet || undefined)} className="flex flex-col items-center gap-2 group">
                <div className="w-full aspect-square rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-white group-active:scale-90 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                  <span className="material-icons-round">send</span>
                </div>
                <span className="text-[9px] font-bold uppercase text-slate-500 tracking-tighter">Send</span>
              </button>
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-full aspect-square rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-white group-active:scale-90 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                  <span className="material-icons-round">history</span>
                </div>
                <span className="text-[9px] font-bold uppercase text-slate-500 tracking-tighter">History</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {!selectedWallet && (
        <section className="px-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-4 gap-4">
            <button onClick={onNavigateToConvert} className="flex flex-col items-center gap-2 group">
              <div className="w-full aspect-square bg-primary text-background-dark rounded-[24px] flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all group-hover:brightness-105">
                <span className="material-icons-round">swap_horiz</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-tighter dark:text-slate-300">Convert</span>
            </button>
            <button onClick={() => onNavigateToSend()} className="flex flex-col items-center gap-2 group">
              <div className="w-full aspect-square bg-white dark:bg-surface-dark text-slate-900 dark:text-white rounded-[24px] flex items-center justify-center border border-slate-200 dark:border-white/5 active:scale-95 transition-all group-hover:bg-slate-50 dark:group-hover:bg-surface-dark/80">
                <span className="material-icons-round">send</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-tighter dark:text-slate-300">Send</span>
            </button>
            <button 
              onClick={() => onNavigateToReceive(wallets[0])}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-full aspect-square bg-white dark:bg-surface-dark text-slate-900 dark:text-white rounded-[24px] flex items-center justify-center border border-slate-200 dark:border-white/5 active:scale-95 transition-all group-hover:bg-slate-50 dark:group-hover:bg-surface-dark/80">
                <span className="material-icons-round">add</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-tighter dark:text-slate-300">Receive</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-full aspect-square bg-white dark:bg-surface-dark text-slate-900 dark:text-white rounded-[24px] flex items-center justify-center border border-slate-200 dark:border-white/5 active:scale-95 transition-all group-hover:bg-slate-50 dark:group-hover:bg-surface-dark/80">
                <span className="material-icons-round">credit_card</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-tighter dark:text-slate-300">Cards</span>
            </button>
          </div>
        </section>
      )}

      {/* Activity List */}
      <section className="px-6 flex-1">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">Recent Activity</h3>
          <button className="text-primary text-sm font-bold uppercase tracking-wide">See All</button>
        </div>
        <div className="space-y-3">
          {RECENT_ACTIVITY.filter(tx => !selectedWallet || tx.currency === selectedWallet.currency).map((tx) => (
            <div 
              key={tx.id} 
              onClick={() => onNavigateToTransaction(tx)}
              className="bg-white dark:bg-surface-dark/50 p-4 rounded-[24px] flex items-center justify-between border border-slate-100 dark:border-white/5 cursor-pointer active:scale-[0.98] transition-all hover:bg-slate-50 dark:hover:bg-surface-dark/80"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'income' ? 'bg-primary/10' : 'bg-slate-100 dark:bg-surface-dark'}`}>
                  <span className={`material-icons-round ${tx.type === 'income' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
                    {tx.icon}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-sm">{tx.name}</p>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${tx.type === 'income' ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                  {tx.amount > 0 ? '+' : '-'}{tx.currency === 'USD' ? '$' : tx.currency === 'EUR' ? '€' : tx.currency === 'GBP' ? '£' : '₦'}
                  {Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{tx.currency} Wallet</p>
              </div>
            </div>
          ))}
        </div>
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
              {currenciesToAdd.map((c) => (
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
