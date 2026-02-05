
import React, { useState } from 'react';
import { Wallet } from '../types';

interface ReceiveProps {
  wallet: Wallet;
  onBack: () => void;
}

const Receive: React.FC<ReceiveProps> = ({ wallet, onBack }) => {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleShare = async () => {
    if (!wallet.bankAccount) return;
    const details = wallet.bankAccount.details.map(d => `${d.label}: ${d.value}`).join('\n');
    const shareText = `Bank: ${wallet.bankAccount.institution}\nAccount Name: ${wallet.bankAccount.accountName}\n${details}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Zerah ${wallet.currency} Bank Details`,
          text: shareText,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      copyToClipboard(shareText, "All details");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark relative">
      <header className="px-6 py-4 flex items-center justify-between z-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 dark:bg-white/10 active:scale-90 transition-all"
        >
          <span className="material-icons-round text-lg">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold">Receive {wallet.currency}</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your Bank Account</p>
        </div>
        <button 
          onClick={handleShare}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 dark:bg-white/10 active:scale-90 transition-all"
        >
          <span className="material-icons-round text-lg">share</span>
        </button>
      </header>

      <main className="flex-1 px-6 pt-6 flex flex-col z-10">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-[32px] bg-white dark:bg-surface-dark shadow-2xl flex items-center justify-center border-4 border-primary/20 p-4">
              <img src={wallet.flagUrl} alt="" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center border-4 border-background-light dark:border-background-dark">
              <span className="material-icons-round text-background-dark">account_balance</span>
            </div>
          </div>
        </div>

        {wallet.bankAccount ? (
          <div className="space-y-6">
            <div className="bg-white/50 dark:bg-surface-dark border border-slate-200 dark:border-white/5 p-6 rounded-[32px] backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Bank Institution</p>
              <p className="text-xl font-black">{wallet.bankAccount.institution}</p>
              
              <div className="h-px bg-slate-100 dark:bg-white/5 my-5"></div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Beneficiary Name</p>
                  <p className="font-bold text-lg">{wallet.bankAccount.accountName}</p>
                </div>

                {wallet.bankAccount.details.map((detail, idx) => (
                  <div key={idx} className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{detail.label}</p>
                      <p className="font-mono font-bold text-lg break-all">{detail.value}</p>
                    </div>
                    {detail.isCopyable && (
                      <button 
                        onClick={() => copyToClipboard(detail.value, detail.label)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ml-4 ${
                          copyFeedback === detail.label 
                            ? 'bg-green-500 text-white' 
                            : 'bg-primary/10 text-primary border border-primary/20'
                        }`}
                      >
                        <span className="material-icons-round">{copyFeedback === detail.label ? 'check' : 'content_copy'}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-[28px] bg-primary/5 border border-primary/20 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="material-icons-round text-primary text-xl">security</span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                This is a virtual {wallet.currency} account provided by Zerah for seamless incoming transfers. Funds are credited instantly after the bank settles the payment.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <span className="material-icons-round text-6xl mb-4">error_outline</span>
            <p className="font-bold">Account details unavailable</p>
          </div>
        )}
      </main>

      <footer className="px-6 py-8 z-10">
        <button 
          onClick={handleShare}
          className="w-full bg-primary text-background-dark py-5 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20 uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <span className="material-icons-round">share</span>
          <span>Share Details</span>
        </button>
      </footer>
    </div>
  );
};

export default Receive;
