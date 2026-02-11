
import React, { useState, useEffect } from 'react';
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

// Updated to the newest logo asset provided by the user
const LOGO_URL = "https://lh3.googleusercontent.com/d/1CI2jqRX0yMn6oo9RCKcbwyJ3mRlhrSF-";

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 800); 
    }, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Robust SVG fallback that matches the requested ribbon 'Z' design
  const RibbonZFallback = () => (
    <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-[0_20px_50px_rgba(183,204,22,0.4)]">
      <defs>
        <linearGradient id="ribbonGradFallback" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B7CC16" />
          <stop offset="50%" stopColor="#A4B812" />
          <stop offset="100%" stopColor="#8A9C0F" />
        </linearGradient>
      </defs>
      <path 
        d="M100,100 L300,100 C300,100 350,110 320,160 L120,380 C100,410 80,430 150,430 L350,430" 
        fill="none" 
        stroke="url(#ribbonGradFallback)" 
        strokeWidth="70" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path d="M300,100 C310,130 300,160 260,195" fill="none" stroke="#000000" strokeWidth="70" opacity="0.1" strokeLinecap="round" />
      <path d="M120,380 C110,350 120,320 160,285" fill="none" stroke="#000000" strokeWidth="70" opacity="0.1" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className={`fixed inset-0 z-[1000] bg-background-dark flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isFading ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative">
        {/* Subtle background glow - removed animation as per user request */}
        <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full"></div>
        
        {/* Static 'Z' Logo - no animation applied */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {!imgError ? (
            <img 
              src={LOGO_URL} 
              alt="Zerah Finance"
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(183,204,22,0.4)]"
              onLoad={() => console.log("Splash logo loaded successfully")}
              onError={() => {
                console.error("Failed to load splash logo from Drive URL, using fallback.");
                setImgError(true);
              }}
            />
          ) : (
            <RibbonZFallback />
          )}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center">
        <h1 className="text-white font-black text-3xl tracking-[0.3em] uppercase mb-2">
          ZERAH FINANCE
        </h1>
        <div className="flex items-center gap-2 mb-8">
          <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase">Private Wealth Engine</span>
        </div>
        
        {/* Progress indicator */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-progress origin-left"></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 3s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [activeWallet, setActiveWallet] = useState<Wallet | null>(null);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [isSplashActive, setIsSplashActive] = useState(true);

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
            onNavigateToCards={() => setCurrentView(View.CARDS)}
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
        return null;
    }
  };

  const showNav = ![View.CONVERT, View.SEND, View.RECEIVE, View.TRANSACTION_DETAILS, View.PROFILE, View.NOTIFICATIONS].includes(currentView);

  return (
    <div className="flex justify-center min-h-screen w-full relative overflow-hidden transition-colors duration-500">
      {isSplashActive && <SplashScreen onComplete={() => setIsSplashActive(false)} />}
      
      <div className="absolute inset-0 pattern-overlay pointer-events-none"></div>
      
      <div className={`w-full max-w-md flex flex-col relative z-10 bg-background-light dark:bg-background-dark min-h-screen transition-opacity duration-1000 ${isSplashActive ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex-1">
          {renderContent()}
        </div>

        {showNav && (
          <Navigation currentView={currentView} onNavigate={setCurrentView} />
        )}
      </div>

      <button 
        className={`fixed bottom-24 right-4 md:right-auto md:left-[calc(50%+200px)] bg-white dark:bg-surface-dark p-3 rounded-full shadow-lg border border-slate-200 dark:border-white/10 z-[60] active:scale-95 transition-all ${isSplashActive ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
        onClick={() => document.documentElement.classList.toggle('dark')}
      >
        <span className="material-icons-round dark:text-white block">
          dark_mode
        </span>
      </button>
    </div>
  );
};

export default App;
