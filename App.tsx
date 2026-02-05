
import React, { useState } from 'react';
import { View, Wallet, Transaction } from './types';
import Home from './components/Home';
import Convert from './components/Convert';
import Send from './components/Send';
import Receive from './components/Receive';
import TransactionDetails from './components/TransactionDetails';
import Wallets from './components/Wallets';
import Cards from './components/Cards';
import Engine from './components/Engine';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import Navigation from './components/Navigation';
import { INITIAL_WALLETS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [activeWallet, setActiveWallet] = useState<Wallet | null>(null);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  const handleAddWallet = (newWallet: Wallet) => {
    setWallets(prev => [...prev, newWallet]);
  };

  const handleNavigateToReceive = (wallet: Wallet) => {
    setActiveWallet(wallet);
    setCurrentView(View.RECEIVE);
  };

  const handleNavigateToSend = (wallet?: Wallet) => {
    if (wallet) {
      setActiveWallet(wallet);
    } else {
      setActiveWallet(null);
    }
    setCurrentView(View.SEND);
  };

  const handleNavigateToTransaction = (tx: Transaction) => {
    setActiveTransaction(tx);
    setCurrentView(View.TRANSACTION_DETAILS);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.HOME:
        return (
          <Home 
            wallets={wallets}
            onAddWallet={handleAddWallet}
            onNavigateToConvert={() => setCurrentView(View.CONVERT)} 
            onNavigateToSend={handleNavigateToSend}
            onNavigateToReceive={handleNavigateToReceive}
            onNavigateToTransaction={handleNavigateToTransaction}
            onNavigateToProfile={() => setCurrentView(View.PROFILE)}
            onNavigateToNotifications={() => setCurrentView(View.NOTIFICATIONS)}
          />
        );
      case View.CONVERT:
        return <Convert onBack={() => setCurrentView(View.HOME)} />;
      case View.SEND:
        return (
          <Send 
            wallets={wallets} 
            onBack={() => { setActiveWallet(null); setCurrentView(View.HOME); }} 
            initialWallet={activeWallet || undefined}
          />
        );
      case View.RECEIVE:
        return (
          <Receive 
            wallet={activeWallet || wallets[0]} 
            onBack={() => { setActiveWallet(null); setCurrentView(View.HOME); }} 
          />
        );
      case View.TRANSACTION_DETAILS:
        return (
          <TransactionDetails 
            transaction={activeTransaction} 
            onBack={() => setCurrentView(View.HOME)} 
          />
        );
      case View.WALLETS:
        return (
          <Wallets 
            wallets={wallets}
            onAddWallet={handleAddWallet}
            onNavigateToReceive={handleNavigateToReceive}
            onNavigateToSend={handleNavigateToSend}
          />
        );
      case View.CARDS:
        return <Cards onBack={() => setCurrentView(View.HOME)} />;
      case View.ENGINE:
        return <Engine onBack={() => setCurrentView(View.HOME)} />;
      case View.PROFILE:
        return <Profile onBack={() => setCurrentView(View.HOME)} />;
      case View.NOTIFICATIONS:
        return <Notifications onBack={() => setCurrentView(View.HOME)} />;
      default:
        return (
          <Home 
            wallets={wallets}
            onAddWallet={handleAddWallet}
            onNavigateToConvert={() => setCurrentView(View.CONVERT)} 
            onNavigateToSend={handleNavigateToSend}
            onNavigateToReceive={handleNavigateToReceive}
            onNavigateToTransaction={handleNavigateToTransaction}
            onNavigateToProfile={() => setCurrentView(View.PROFILE)}
            onNavigateToNotifications={() => setCurrentView(View.NOTIFICATIONS)}
          />
        );
    }
  };

  const showNav = ![View.CONVERT, View.SEND, View.RECEIVE, View.TRANSACTION_DETAILS, View.PROFILE, View.NOTIFICATIONS].includes(currentView);

  return (
    <div className="flex justify-center min-h-screen w-full relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 pattern-overlay pointer-events-none"></div>
      
      <div className="w-full max-w-md flex flex-col relative z-10 bg-background-light dark:bg-background-dark min-h-screen">
        <div className="flex-1">
          {renderContent()}
        </div>

        {showNav && (
          <Navigation currentView={currentView} onNavigate={setCurrentView} />
        )}
      </div>

      <button 
        className="fixed bottom-24 right-4 md:right-auto md:left-[calc(50%+200px)] bg-white dark:bg-surface-dark p-3 rounded-full shadow-lg border border-slate-200 dark:border-white/10 z-[60] active:scale-95 transition-all"
        onClick={() => document.documentElement.classList.toggle('dark')}
      >
        <span className="material-icons-round dark:text-white block">
          {typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </div>
  );
};

export default App;
