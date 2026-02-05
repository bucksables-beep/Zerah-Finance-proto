
import React, { useState, useEffect } from 'react';
import { Wallet } from '../types';

interface SendProps {
  wallets: Wallet[];
  onBack: () => void;
  initialWallet?: Wallet;
}

interface Beneficiary {
  name: string;
  bankName: string;
  accountNumber: string;
  identifier?: string; 
}

const Send: React.FC<SendProps> = ({ wallets, onBack, initialWallet }) => {
  const [step, setStep] = useState<'amount' | 'beneficiary' | 'pin' | 'processing' | 'success'>('amount');
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(initialWallet || wallets[0]);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  
  const [inputValue, setInputValue] = useState('0');
  const [numericValue, setNumericValue] = useState(0);
  
  const [beneficiary, setBeneficiary] = useState<Beneficiary>({
    name: '',
    bankName: '',
    accountNumber: '',
  });

  const [pin, setPin] = useState<string>('');
  const [transactionId, setTransactionId] = useState('');

  const handleKeyPress = (key: string) => {
    let current = inputValue.replace(/,/g, '');
    if (key === 'backspace') {
      current = current.slice(0, -1);
    } else if (key === '.') {
      if (!current.includes('.')) current += '.';
    } else {
      if (current === '0') current = key;
      else current += key;
    }

    if (current === '') current = '0';
    
    const num = parseFloat(current);
    if (!isNaN(num)) {
      setNumericValue(num);
      const parts = current.split('.');
      parts[0] = Math.floor(parseFloat(parts[0])).toLocaleString();
      setInputValue(parts.join('.'));
    } else if (current === '0' || current === '') {
      setNumericValue(0);
      setInputValue('0');
    }
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
      // Small delay for visual feedback of the last digit
      const timer = setTimeout(() => {
        setStep('processing');
        setTransactionId('TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase());
        
        setTimeout(() => {
          setStep('success');
        }, 2500);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pin]);

  const handleConfirmBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiary.name || !beneficiary.accountNumber) return;
    setStep('pin');
  };

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark p-6">
        <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-4 border-white/5 border-b-primary/40 animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-icons-round text-primary text-4xl">send</span>
            </div>
        </div>
        <h2 className="text-xl font-bold mb-2 animate-pulse uppercase tracking-[0.2em]">Sending Funds</h2>
        <p className="text-slate-400 text-sm max-w-[200px] text-center">Your request is being processed by the network...</p>
      </div>
    );
  }

  if (step === 'pin') {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark p-6 z-[120] animate-in slide-in-from-bottom-20 duration-500">
        <header className="py-4 mb-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
             <span className="material-icons-round text-primary text-3xl">lock</span>
          </div>
          <h2 className="text-2xl font-black mb-1">Enter Security PIN</h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Verify your identity to proceed</p>
        </header>

        <main className="flex-1 flex flex-col items-center">
          <div className="flex gap-4 mb-16">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  pin.length > i 
                    ? 'bg-primary border-primary scale-125 shadow-[0_0_15px_rgba(183,204,22,0.5)]' 
                    : 'border-slate-300 dark:border-white/20'
                }`}
              />
            ))}
          </div>

          <div className="w-full max-w-xs grid grid-cols-3 gap-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handlePinPress(digit)}
                className="w-full aspect-square rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 text-2xl font-black active:scale-90 active:bg-primary active:text-background-dark transition-all flex items-center justify-center"
              >
                {digit}
              </button>
            ))}
            <div />
            <button
              onClick={() => handlePinPress('0')}
              className="w-full aspect-square rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 text-2xl font-black active:scale-90 active:bg-primary active:text-background-dark transition-all flex items-center justify-center"
            >
              0
            </button>
            <button
              onClick={handlePinBackspace}
              className="w-full aspect-square rounded-2xl flex items-center justify-center active:scale-90 text-slate-400"
            >
              <span className="material-icons-round text-3xl">backspace</span>
            </button>
          </div>
          
          <button className="mt-12 text-primary font-bold text-xs uppercase tracking-widest hover:underline">
            Forgot Security PIN?
          </button>
        </main>

        <footer className="py-8">
           <button 
             onClick={() => { setStep('beneficiary'); setPin(''); }}
             className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-xs"
           >
             Cancel Transaction
           </button>
        </footer>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark p-6 animate-in fade-in duration-700">
        <div className="flex-1 flex flex-col items-center pt-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 mb-6 animate-in zoom-in duration-500 delay-200">
            <span className="material-icons-round text-background-dark text-4xl">check</span>
          </div>
          <h2 className="text-2xl font-black mb-1">Transfer Sent!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 text-center">
            {selectedWallet.symbol}{numericValue.toLocaleString()} successfully sent to {beneficiary.name}.
          </p>

          <div className="w-full bg-white dark:bg-surface-dark rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction Receipt</span>
                <span className="text-[10px] font-bold text-slate-400">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col items-center mb-6">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Amount Sent</p>
                <h3 className="text-4xl font-black text-primary">{selectedWallet.symbol}{numericValue.toLocaleString()}</h3>
              </div>
              <div className="space-y-4 pt-4 border-t border-dashed border-slate-200 dark:border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Recipient</span>
                  <span className="font-bold">{beneficiary.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Bank</span>
                  <span className="font-bold">{beneficiary.bankName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Account</span>
                  <span className="font-mono font-bold">{beneficiary.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">TXN ID</span>
                  <span className="font-mono font-bold text-xs">{transactionId}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-4 text-center">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Funds typically arrive within 24 hours</span>
            </div>
          </div>
        </div>
        <div className="mt-auto pb-8">
          <button 
            onClick={onBack}
            className="w-full bg-primary text-background-dark py-5 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20 uppercase tracking-widest active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark relative">
      <header className="px-6 py-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 dark:bg-white/10 active:scale-90 transition-all">
          <span className="material-icons-round text-lg">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold">Send Money</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-6 pt-4 flex flex-col z-10">
        <div 
          onClick={() => setShowWalletSelector(true)}
          className="bg-white/50 dark:bg-surface-dark border border-slate-200 dark:border-white/5 p-6 rounded-[32px] mb-6 backdrop-blur-sm cursor-pointer active:scale-[0.98] transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary shadow-sm">
              <img src={selectedWallet.flagUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">From Wallet</p>
              <p className="font-bold">{selectedWallet.label} ({selectedWallet.currency})</p>
            </div>
          </div>
          <span className="material-icons-round text-slate-400">expand_more</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Amount to Send</p>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-slate-400">{selectedWallet.symbol}</span>
            <h2 className="text-6xl font-black tracking-tighter">
              {inputValue}<span className="text-primary animate-pulse">|</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-4">Balance: {selectedWallet.symbol}{selectedWallet.balance.toLocaleString()}</p>
        </div>

        <div className="pb-8 space-y-4">
          <div className="grid grid-cols-3 gap-y-2 gap-x-4 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
              <button 
                key={key}
                onClick={() => handleKeyPress(key)}
                className="h-12 text-2xl font-bold flex items-center justify-center rounded-2xl hover:bg-slate-200/50 dark:hover:bg-white/5 active:scale-95 transition-all"
              >
                {key === 'backspace' ? <span className="material-icons-round">backspace</span> : key}
              </button>
            ))}
          </div>
          <button 
            disabled={numericValue <= 0 || numericValue > selectedWallet.balance}
            onClick={() => setStep('beneficiary')}
            className="w-full bg-primary text-background-dark py-5 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20 uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            Continue
          </button>
        </div>
      </main>

      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm animate-in fade-in" onClick={() => setShowWalletSelector(false)}></div>
          <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[40px] p-6 relative z-10 animate-in slide-in-from-bottom-20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Choose Wallet</h3>
              <button onClick={() => setShowWalletSelector(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full">
                <span className="material-icons-round text-slate-400">close</span>
              </button>
            </div>
            <div className="space-y-3">
              {wallets.map((w) => (
                <button
                  key={w.currency}
                  onClick={() => { setSelectedWallet(w); setShowWalletSelector(false); }}
                  className={`w-full flex items-center justify-between p-4 rounded-[24px] border-2 transition-all ${selectedWallet.currency === w.currency ? 'border-primary bg-primary/10' : 'border-transparent bg-slate-50 dark:bg-white/5'}`}
                >
                  <div className="flex items-center gap-4">
                    <img src={w.flagUrl} alt="" className="w-10 h-7 rounded shadow-sm" />
                    <div className="text-left">
                      <p className="font-bold text-sm">{w.label}</p>
                      <p className="text-[10px] text-slate-500">{w.symbol}{w.balance.toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedWallet.currency === w.currency && <span className="material-icons-round text-primary">check_circle</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Beneficiary Details Modal */}
      {step === 'beneficiary' && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm animate-in fade-in" onClick={() => setStep('amount')}></div>
          <form 
            onSubmit={handleConfirmBeneficiary}
            className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[40px] p-8 relative z-10 animate-in slide-in-from-bottom-20 duration-500"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Recipient Details</h3>
              <button type="button" onClick={() => setStep('amount')} className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full">
                <span className="material-icons-round text-slate-400">close</span>
              </button>
            </div>

            <div className="space-y-6 mb-10">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Beneficiary Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl p-4 font-bold focus:ring-2 ring-primary/50 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  value={beneficiary.name}
                  onChange={(e) => setBeneficiary({...beneficiary, name: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Bank Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Chase Bank, Wema Bank"
                  className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl p-4 font-bold focus:ring-2 ring-primary/50 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  value={beneficiary.bankName}
                  onChange={(e) => setBeneficiary({...beneficiary, bankName: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Account Number / IBAN</label>
                <input 
                  required
                  type="text" 
                  placeholder="0000 0000 0000"
                  className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl p-4 font-bold focus:ring-2 ring-primary/50 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-mono"
                  value={beneficiary.accountNumber}
                  onChange={(e) => setBeneficiary({...beneficiary, accountNumber: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-2xl mb-8 border border-primary/20 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Final Amount</p>
                <p className="text-xl font-black">{selectedWallet.symbol}{numericValue.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Network Fee</p>
                <p className="font-bold text-slate-500">Free</p>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-background-dark py-5 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20 uppercase tracking-widest active:scale-95 transition-all"
            >
              Confirm Transfer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Send;
