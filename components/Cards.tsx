
import React, { useState, useEffect, useRef } from 'react';
import { RECENT_ACTIVITY } from '../constants';
import { Card, Wallet } from '../types';

interface CardsProps {
  onBack: () => void;
}

const BRAND_LOGO_URL = "https://lh3.googleusercontent.com/d/1CI2jqRX0yMn6oo9RCKcbwyJ3mRlhrSF-";

type CardAction = 'toggleFreeze' | 'revealDetails' | 'createCard';

const INITIAL_CARDS: Card[] = [
  {
    id: '1',
    lastFour: '7482',
    pan: '4532 7482 9103 7482',
    cvv: '123',
    expiry: '12 / 28',
    holder: 'Alex Thompson',
    currency: 'USD',
    isFrozen: false,
    type: 'Platinum',
    color: 'from-[#1a1a1a] via-[#052826] to-[#0A3532]'
  }
];

const Cards: React.FC<CardsProps> = ({ onBack }) => {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [activeAction, setActiveAction] = useState<CardAction | null>(null);
  const [pin, setPin] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Creation Flow States
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [createStep, setCreateStep] = useState<'currency' | 'pin' | 'processing'>('currency');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const activeCard = cards[activeCardIndex];

  // Filter for transactions associated with active card currency
  const cardTransactions = RECENT_ACTIVITY.filter(tx => tx.currency === activeCard.currency).slice(0, 3);

  const initiateAction = (action: CardAction) => {
    setActiveAction(action);
    setShowPinEntry(true);
    setPin('');
  };

  const handlePinPress = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handlePinBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === 4) {
      const timer = setTimeout(() => {
        if (activeAction === 'toggleFreeze') {
          const updatedCards = [...cards];
          updatedCards[activeCardIndex].isFrozen = !updatedCards[activeCardIndex].isFrozen;
          setCards(updatedCards);
          setStatusMessage(updatedCards[activeCardIndex].isFrozen ? "Card Frozen Successfully" : "Card Unfrozen Successfully");
          setShowPinEntry(false);
        } else if (activeAction === 'revealDetails') {
          setShowDetails(prev => !prev);
          setStatusMessage(showDetails ? "Card Details Hidden" : "Card Details Revealed");
          setShowPinEntry(false);
        } else if (activeAction === 'createCard') {
          setCreateStep('processing');
          handleCreateCard();
        }
        
        if (activeAction !== 'createCard') {
          setActiveAction(null);
          setPin('');
        }
        setTimeout(() => setStatusMessage(null), 3000);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pin, activeAction]);

  const handleCreateCard = () => {
    // Simulate generation
    setTimeout(() => {
      const newCard: Card = {
        id: Math.random().toString(36).substr(2, 9),
        lastFour: Math.floor(1000 + Math.random() * 9000).toString(),
        pan: `4532 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        cvv: Math.floor(100 + Math.random() * 900).toString(),
        expiry: '05 / 30',
        holder: 'Alex Thompson',
        currency: selectedCurrency,
        isFrozen: false,
        type: selectedCurrency === 'EUR' ? 'Gold' : (selectedCurrency === 'GBP' ? 'Black' : 'Platinum'),
        color: selectedCurrency === 'EUR' ? 'from-[#434343] to-[#000000]' : (selectedCurrency === 'GBP' ? 'from-[#2c3e50] to-[#000000]' : 'from-[#1a1a1a] via-[#052826] to-[#0A3532]')
      };
      setCards(prev => [...prev, newCard]);
      setActiveCardIndex(cards.length); // Switch to the new card
      setShowCreateFlow(false);
      setPin('');
      setActiveAction(null);
      setStatusMessage(`New ${selectedCurrency} Virtual Card Created!`);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-full pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
      <header className="px-6 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Virtual Cards</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Secure your spending</p>
        </div>
        <button 
          onClick={() => {
            setShowCreateFlow(true);
            setCreateStep('currency');
            setPin('');
          }}
          className="w-12 h-12 rounded-2xl bg-primary text-background-dark flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-transform"
        >
          <span className="material-icons-round">add</span>
        </button>
      </header>

      {statusMessage && (
        <div className="px-6 mb-4 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-primary/20 border border-primary/40 text-primary py-3 px-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/10">
            <span className="material-icons-round text-sm">verified</span>
            {statusMessage}
          </div>
        </div>
      )}

      {/* Card Carousel */}
      <section className="mb-10 overflow-x-auto hide-scrollbar px-6 flex gap-4 snap-x">
        {cards.map((card, index) => (
          <div 
            key={card.id}
            onClick={() => {
              if (activeCardIndex !== index) {
                setActiveCardIndex(index);
                setShowDetails(false);
              }
            }}
            className={`relative flex-shrink-0 w-full snap-center aspect-[1.58/1] rounded-[32px] overflow-hidden transition-all duration-500 cursor-pointer ${
              activeCardIndex === index ? 'scale-100 shadow-2xl' : 'scale-90 opacity-40 shadow-none grayscale blur-[1px]'
            } ${card.isFrozen ? 'grayscale opacity-60' : ''}`}
          >
            {/* Card Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color}`}></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center backdrop-blur-md">
                     <img src={BRAND_LOGO_URL} className="w-6 h-6 object-contain" alt="Zerah" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{card.type} Virtual ({card.currency})</span>
                </div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 object-contain" alt="Mastercard" />
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  {(showDetails && activeCardIndex === index) ? (
                    <span className="text-lg font-bold tracking-[0.15em] text-white/90 font-mono animate-in fade-in">
                      {card.pan}
                    </span>
                  ) : (
                    <>
                      <span className="text-xl font-bold tracking-[0.2em] text-white/90">••••</span>
                      <span className="text-xl font-bold tracking-[0.2em] text-white/90">••••</span>
                      <span className="text-xl font-bold tracking-[0.2em] text-white/90">••••</span>
                      <span className="text-xl font-bold tracking-[0.2em] text-white/90">{card.lastFour}</span>
                    </>
                  )}
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Card Holder</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/80">{card.holder}</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Expires</p>
                      <p className="text-xs font-bold text-white/80">{card.expiry}</p>
                    </div>
                    {(showDetails && activeCardIndex === index) && (
                      <div className="animate-in slide-in-from-right-2">
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">CVV</p>
                        <p className="text-xs font-bold text-white/80 font-mono">{card.cvv}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {card.isFrozen && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 backdrop-blur-[2px]">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full shadow-2xl animate-in zoom-in duration-300">
                  <span className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="material-icons-round text-sm">ac_unit</span>
                    Frozen
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-1.5 mb-8">
        {cards.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${activeCardIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-slate-300 dark:bg-white/10'}`} />
        ))}
      </div>

      {/* Controls */}
      <section className="px-6 space-y-4 mb-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-2">Management</h3>
        
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 p-6 rounded-[32px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activeCard.isFrozen ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
              <span className="material-icons-round">{activeCard.isFrozen ? 'ac_unit' : 'bolt'}</span>
            </div>
            <div>
              <p className="font-bold">Freeze Card</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Instantly disable spending</p>
            </div>
          </div>
          <button 
            onClick={() => initiateAction('toggleFreeze')}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${activeCard.isFrozen ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white dark:bg-slate-900 rounded-full transition-all duration-300 shadow-md ${activeCard.isFrozen ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => initiateAction('revealDetails')}
            className={`bg-white dark:bg-surface-dark border p-6 rounded-[32px] flex flex-col gap-4 text-left group active:scale-95 transition-all ${
              showDetails ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 dark:border-white/5'
            }`}
          >
            <span className={`material-icons-round transition-colors ${showDetails ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
              {showDetails ? 'visibility_off' : 'visibility'}
            </span>
            <div>
              <p className="font-bold text-sm">{showDetails ? 'Hide Details' : 'View Details'}</p>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tight">Show PAN & CVV</p>
            </div>
          </button>
          <button className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 p-6 rounded-[32px] flex flex-col gap-4 text-left group active:scale-95 transition-all">
            <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors">settings_suggest</span>
            <div>
              <p className="font-bold text-sm">Limits</p>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tight">Set daily caps</p>
            </div>
          </button>
        </div>
      </section>

      {/* Card Specific Activity */}
      <section className="px-6 mb-12">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">{activeCard.currency} Card Activity</h3>
          <button className="text-primary text-sm font-bold uppercase tracking-wide">Statement</button>
        </div>
        <div className="space-y-3">
          {cardTransactions.map((tx) => (
            <div 
              key={tx.id} 
              className="bg-white dark:bg-surface-dark/40 p-5 rounded-[28px] flex items-center justify-between border border-slate-100 dark:border-white/5 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'income' ? 'bg-primary/10' : 'bg-slate-100 dark:bg-white/5'}`}>
                  <span className={`material-icons-round ${tx.type === 'income' ? 'text-primary' : 'text-slate-400 dark:text-slate-300'}`}>
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
                  {tx.amount > 0 ? '+' : '-'}{activeCard.currency === 'USD' ? '$' : activeCard.currency === 'EUR' ? '€' : '£'}{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Digital Auth</p>
              </div>
            </div>
          ))}
          {cardTransactions.length === 0 && (
            <div className="py-10 text-center text-slate-400 opacity-50 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[32px]">
              <span className="material-icons-round text-4xl mb-2">history</span>
              <p className="text-xs font-bold uppercase tracking-widest">No recent card activity</p>
            </div>
          )}
        </div>
      </section>

      {/* Main PIN Modal (Freeze/Reveal) */}
      {showPinEntry && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-background-dark/95 backdrop-blur-xl animate-in fade-in" onClick={() => { setShowPinEntry(false); setActiveAction(null); }}></div>
          <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[40px] p-8 relative z-10 animate-in slide-in-from-bottom-20 flex flex-col items-center shadow-2xl">
            <header className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                 <span className="material-icons-round text-primary text-3xl">lock</span>
              </div>
              <h2 className="text-xl font-black mb-1">Verify Identity</h2>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                Confirm your 4-digit security PIN
              </p>
            </header>

            <div className="flex gap-4 mb-12">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                    pin.length > i ? 'bg-primary border-primary scale-125' : 'border-slate-300 dark:border-white/20'
                  }`}
                />
              ))}
            </div>

            <div className="w-full max-w-xs grid grid-cols-3 gap-6 mb-8">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'].map((digit, idx) => {
                if (digit === '') return <div key={idx} />;
                return (
                  <button
                    key={digit}
                    onClick={() => digit === 'backspace' ? handlePinBackspace() : handlePinPress(digit)}
                    className={`w-full aspect-square rounded-2xl text-2xl font-black active:scale-90 transition-all flex items-center justify-center ${
                      digit === 'backspace' ? 'text-slate-400' : 'bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 active:bg-primary active:text-background-dark'
                    }`}
                  >
                    {digit === 'backspace' ? <span className="material-icons-round text-3xl">backspace</span> : digit}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Create Card Flow Modal */}
      {showCreateFlow && (
        <div className="fixed inset-0 z-[400] flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-background-dark/95 backdrop-blur-xl animate-in fade-in" onClick={() => setShowCreateFlow(false)}></div>
          <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[40px] p-8 relative z-10 animate-in slide-in-from-bottom-20 flex flex-col shadow-2xl">
            {createStep === 'currency' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black">Create Virtual Card</h2>
                  <button onClick={() => setShowCreateFlow(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full">
                    <span className="material-icons-round text-slate-400">close</span>
                  </button>
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Select Linked Wallet</p>
                <div className="space-y-3 mb-10">
                  {['USD', 'EUR', 'GBP'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setSelectedCurrency(curr)}
                      className={`w-full flex items-center justify-between p-4 rounded-[24px] border-2 transition-all ${
                        selectedCurrency === curr ? 'bg-primary/10 border-primary' : 'bg-slate-50 dark:bg-white/5 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shadow-sm flex items-center justify-center bg-slate-200 dark:bg-surface-dark">
                          <img 
                            src={curr === 'USD' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoF6D8y7lrZdYdQ9xuxVDOBKawVE0kYNjHECZMmKkNm83JfarO5i9Y3NgGpc-GY4fH28rHoFUZcrtNbGqVB13hziI62eaYuJ2BGs-Z_vnT2_kk-Gec9ojXjO4cjYZiXpKzxWWrfSQN9EmN3bD1ZPTnjgdB1fI-5w8Dz1dSPoIOlPNijwQcqs3oUuQb_0x4b4OIlJnPT4tPi_yKPhJ5IudV5Z0WNziERaDdMS-6CIvEIZwCLdf-bemP-cY-AsVkdTvEtMGbAwej2WMA' : (curr === 'EUR' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1hr7ylQPb0b9NF44Ks3TAPF8RcWc_bUMuRs49wnaYVZLDh50qmsO6ygaCtQ3xMipl-F8QtWNhMz9YkFS51SK-ttmrReqhul2_Einztf0HTiQ5ndkXgo56PKnmdI-fv3wlZ_zaMh4qWSbDf6BJ3s3WvzZB-uDkKn6briopREb7prp3uCpoDp42l6mgTymPdmjqDv5WASQ9Ox4d8wr5qU1r05Ea23jpTMcksUntsmAb-vxTwnMhFOUCNFBcnll6Asser6-vDg_MVuxx' : 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9i7dY5Sob6iUB1EHN-Koa2sySRh_CV0VpRoCMbgcdkN1XHqIHQefRLtZfTE0BA9ixzFBGaGpCrDzkyayutbcUTE_orWbreImvZTBuiC132uE9s3YtAFdYv1ske9Q0XgpkmFDaFrgPzP6-WUlzhQri9r9cVFbsIfUM27VluNL38BVKQhtF8UkOzuhr2jRkKjsu5j3299vd2fs_PY3WpCvOpwBcmGmMWoD7CCL0dPdVl-iegQVA5CWkmL4WyfYMG4y451yweufBousl')} 
                            className="w-full h-full object-cover" 
                            alt={curr} 
                          />
                        </div>
                        <span className="font-bold">{curr} Virtual Card</span>
                      </div>
                      {selectedCurrency === curr && <span className="material-icons-round text-primary">check_circle</span>}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setActiveAction('createCard');
                    setCreateStep('pin');
                  }}
                  className="w-full bg-primary text-background-dark py-5 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20 uppercase tracking-widest active:scale-95 transition-all"
                >
                  Confirm Selection
                </button>
              </div>
            )}

            {createStep === 'pin' && (
              <div className="animate-in fade-in duration-500 flex flex-col items-center">
                <header className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                     <span className="material-icons-round text-primary text-3xl">lock</span>
                  </div>
                  <h2 className="text-xl font-black mb-1">Security Verification</h2>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Confirm PIN to issue card</p>
                </header>

                <div className="flex gap-4 mb-12">
                  {[0, 1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                        pin.length > i ? 'bg-primary border-primary scale-125' : 'border-slate-300 dark:border-white/20'
                      }`}
                    />
                  ))}
                </div>

                <div className="w-full max-w-xs grid grid-cols-3 gap-6 mb-8">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'].map((digit, idx) => {
                    if (digit === '') return <div key={idx} />;
                    return (
                      <button
                        key={digit}
                        onClick={() => digit === 'backspace' ? handlePinBackspace() : handlePinPress(digit)}
                        className={`w-full aspect-square rounded-2xl text-2xl font-black active:scale-90 transition-all flex items-center justify-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 active:bg-primary active:text-background-dark`}
                      >
                        {digit === 'backspace' ? <span className="material-icons-round text-3xl">backspace</span> : digit}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {createStep === 'processing' && (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
                <div className="relative w-32 h-32 mb-10">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
                    <div className="absolute inset-4 rounded-full border-4 border-white/5 border-b-primary/40 animate-spin-slow"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-icons-round text-primary text-4xl">credit_card</span>
                    </div>
                </div>
                <h2 className="text-2xl font-black mb-3 uppercase tracking-widest">Forging Virtual Asset</h2>
                <p className="text-slate-400 text-sm max-w-[240px]">We're generating your unique card details and securing them on the network...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
