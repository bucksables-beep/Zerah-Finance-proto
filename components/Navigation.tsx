
import React from 'react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const tabs = [
    { id: View.HOME, label: 'Home', icon: 'home' },
    { id: View.WALLETS, label: 'Wallets', icon: 'account_balance_wallet' },
    { id: View.SEND, label: 'Send', icon: 'send' },
    { id: View.CARDS, label: 'Cards', icon: 'credit_card' },
    { id: View.ENGINE, label: 'Engine', icon: 'bolt' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 dark:bg-background-dark/80 ios-blur border-t border-slate-200 dark:border-white/10 px-4 py-4 flex items-center justify-between z-50 rounded-t-[32px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 flex-1 ${
            currentView === tab.id 
              ? 'text-primary' 
              : 'text-slate-400 hover:text-slate-500'
          }`}
        >
          <div className={`relative flex items-center justify-center p-1 rounded-xl transition-all duration-300 ${currentView === tab.id ? 'bg-primary/10' : ''}`}>
            <span className={`material-icons-round text-[24px] ${currentView === tab.id ? 'scale-110' : ''}`}>
              {tab.icon}
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-tight">
            {tab.label}
          </span>
          {currentView === tab.id && (
            <div className="w-1 h-1 bg-primary rounded-full mt-0.5"></div>
          )}
        </button>
      ))}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 dark:bg-white/20 rounded-full"></div>
    </nav>
  );
};

export default Navigation;
