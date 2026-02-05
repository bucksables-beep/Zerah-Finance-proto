
import React from 'react';
import { Transaction } from '../types';

interface TransactionDetailsProps {
  transaction: Transaction | null;
  onBack: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onBack }) => {
  if (!transaction) return null;

  const currencySymbol = transaction.currency === 'USD' ? '$' : transaction.currency === 'EUR' ? '€' : transaction.currency === 'GBP' ? '£' : '₦';
  const status = transaction.status || 'Completed';
  const reference = transaction.reference || `ZRH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

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
          <h1 className="text-lg font-bold">Transaction Details</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Receipt Details</p>
        </div>
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 dark:bg-white/10 active:scale-90 transition-all"
        >
          <span className="material-icons-round text-lg">share</span>
        </button>
      </header>

      <main className="flex-1 px-6 pt-8 flex flex-col z-10">
        <div className="flex flex-col items-center mb-10">
          <div className={`w-20 h-20 rounded-[28px] ${transaction.type === 'income' ? 'bg-primary/20' : 'bg-white dark:bg-surface-dark'} shadow-2xl flex items-center justify-center mb-6 border border-slate-100 dark:border-white/5`}>
            <span className={`material-icons-round text-4xl ${transaction.type === 'income' ? 'text-primary' : 'text-slate-500'}`}>
              {transaction.icon}
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">
            {transaction.type === 'income' ? '+' : '-'}{currencySymbol}{Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{status}</span>
          </div>
        </div>

        <div className="w-full bg-white dark:bg-surface-dark rounded-[32px] overflow-hidden shadow-xl border border-slate-200 dark:border-white/5 relative mb-8">
            {/* Scalloped edges effect */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background-light dark:bg-background-dark z-20 shadow-inner"></div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background-light dark:bg-background-dark z-20 shadow-inner"></div>
            
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Merchant / Recipient</p>
                  <p className="font-bold text-lg">{transaction.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Date & Time</p>
                    <p className="font-bold text-sm">{transaction.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Payment Method</p>
                    <p className="font-bold text-sm">{transaction.currency} Wallet</p>
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-white/5 my-2 border-t-2 border-dashed"></div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Transaction ID</p>
                  <p className="font-mono font-bold text-sm select-all">{reference}</p>
                </div>

                <div className="flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Network Fee</p>
                      <p className="font-bold text-sm">{currencySymbol}0.00</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Amount</p>
                      <p className="font-black text-xl text-primary">{currencySymbol}{Math.abs(transaction.amount).toLocaleString()}</p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-white/5 p-4 flex items-center justify-center gap-2">
               <span className="material-icons-round text-sm text-green-500">verified</span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment Processed by Zerah Engine</span>
            </div>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 py-5 rounded-[24px] font-bold active:scale-95 transition-all">
            <span className="material-icons-round text-slate-400">description</span>
            <span>Download Invoice PDF</span>
          </button>
          <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 py-5 rounded-[24px] font-bold active:scale-95 transition-all text-red-500">
            <span className="material-icons-round">report_problem</span>
            <span>Report a Problem</span>
          </button>
        </div>
      </main>

      <footer className="px-6 py-8 mt-auto">
        <button 
          onClick={onBack}
          className="w-full bg-primary text-background-dark py-5 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20 uppercase tracking-widest active:scale-95 transition-all"
        >
          Back to Activity
        </button>
      </footer>
    </div>
  );
};

export default TransactionDetails;
