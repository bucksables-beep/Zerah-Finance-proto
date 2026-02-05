
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ConvertProps {
  onBack: () => void;
}

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  flagUrl: string;
}

const NGN_FLAG = "https://lh3.googleusercontent.com/aida-public/AB6AXuC6nUcfd4IketzNuR6aBfGSjjVjLc54Um9uCNVrS07a_3jO3f_TKXJxFpyJOqWZYpitye0S3KArDO-_MsSA9QIpIRZutK4T151eNOUHDtiqLp1gWMjI3oKFKTlqQOSFrS7_zsbVLyorB83fl2GXm-IpyYZliOXd4lYy521DwcfN8YEWFK3B5j1PB65OCgUxfl2h03B3xYE-rNHcJpcveEssEf5rHxTusH9FSnzxbLkpHi0iXbsu6g9CO5a2QQp2Ya5cfSGP5VcJq63U";

const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoF6D8y7lrZdYdQ9xuxVDOBKawVE0kYNjHECZMmKkNm83JfarO5i9Y3NgGpc-GY4fH28rHoFUZcrtNbGqVB13hziI62eaYuJ2BGs-Z_vnT2_kk-Gec9ojXjO4cjYZiXpKzxWWrfSQN9EmN3bD1ZPTnjgdB1fI-5w8Dz1dSPoIOlPNijwQcqs3oUuQb_0x4b4OIlJnPT4tPi_yKPhJ5IudV5Z0WNziERaDdMS-6CIvEIZwCLdf-bemP-cY-AsVkdTvEtMGbAwej2WMA' },
  { code: 'EUR', name: 'Euro', symbol: '€', flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1hr7ylQPb0b9NF44Ks3TAPF8RcWc_bUMuRs49wnaYVZLDh50qmsO6ygaCtQ3xMipl-F8QtWNhMz9YkFS51SK-ttmrReqhul2_Einztf0HTiQ5ndkXgo56PKnmdI-fv3wlZ_zaMh4qWSbDf6BJ3s3WvzZB-uDkKn6briopREb7prp3uCpoDp42l6mgTymPdmjqDv5WASQ9Ox4d8wr5qU1r05Ea23jpTMcksUntsmAb-vxTwnMhFOUCNFBcnll6Asser6-vDg_MVuxx' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9i7dY5Sob6iUB1EHN-Koa2sySRh_CV0VpRoCMbgcdkN1XHqIHQefRLtZfTE0BA9ixzFBGaGpCrDzkyayutbcUTE_orWbreImvZTBuiC132uE9s3YtAFdYv1ske9Q0XgpkmFDaFrgPzP6-WUlzhQri9r9cVFbsIfUM27VluNL38BVKQhtF8UkOzuhr2jRkKjsu5j3299vd2fs_PY3WpCvOpwBcmGmMWoD7CCL0dPdVl-iegQVA5CWkmL4WyfYMG4y451yweufBousl' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flagUrl: NGN_FLAG },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$', flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9i7dY5Sob6iUB1EHN-Koa2sySRh_CV0VpRoCMbgcdkN1XHqIHQefRLtZfTE0BA9ixzFBGaGpCrDzkyayutbcUTE_orWbreImvZTBuiC132uE9s3YtAFdYv1ske9Q0XgpkmFDaFrgPzP6-WUlzhQri9r9cVFbsIfUM27VluNL38BVKQhtF8UkOzuhr2jRkKjsu5j3299vd2fs_PY3WpCvOpwBcmGmMWoD7CCL0dPdVl-iegQVA5CWkmL4WyfYMG4y451yweufBousl' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flagUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2e8D_fS9C7u_Y8C-T-k-h_R-Q-T-m-J-v-L-v-R-Q-T-m-J-v-L-v-R-Q-T-m-J-v-L-v-R-Q-T-m-J-v-L-v' }
];

const Convert: React.FC<ConvertProps> = ({ onBack }) => {
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [fromCurrency, setFromCurrency] = useState(CURRENCIES[3]); // Default NGN
  const [toCurrency, setToCurrency] = useState(CURRENCIES[0]); // Default USD
  const [showSelector, setShowSelector] = useState<'from' | 'to' | null>(null);

  const [inputValue, setInputValue] = useState('450,000');
  const [numericValue, setNumericValue] = useState(450000);
  const [exchangeRate, setExchangeRate] = useState(1605.00);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [transactionId, setTransactionId] = useState('');
  const [sources, setSources] = useState<{uri: string, title: string}[]>([]);

  const ZERAH_FEE_PERCENT = 0.001; // 0.1%

  const fetchLiveRate = useCallback(async () => {
    if (fromCurrency.code === toCurrency.code) {
        setExchangeRate(1);
        setIsLoadingRate(false);
        setSources([]);
        return;
    }
    
    setIsLoadingRate(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `What is the current mid-market exchange rate for 1 ${fromCurrency.code} to ${toCurrency.code} right now? Return only the numerical value.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      const text = response.text || "";
      const matches = text.match(/(\d+[,.]\d+)|(\d+)/g);
      if (matches && matches.length > 0) {
        const rate = parseFloat(matches[0].replace(',', ''));
        if (!isNaN(rate)) {
          setExchangeRate(rate);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      }

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        const extractedSources = groundingChunks
          .filter((chunk: any) => chunk.web)
          .map((chunk: any) => ({
            uri: chunk.web.uri,
            title: chunk.web.title
          }));
        setSources(extractedSources);
      }
    } catch (error) {
      console.error("Failed to fetch live rate:", error);
    } finally {
      setIsLoadingRate(false);
    }
  }, [fromCurrency.code, toCurrency.code]);

  useEffect(() => {
    if (step === 'input') {
      fetchLiveRate();
      const interval = setInterval(fetchLiveRate, 60000);
      return () => clearInterval(interval);
    }
  }, [fetchLiveRate, step]);

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

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const selectCurrency = (currency: CurrencyOption) => {
    if (showSelector === 'from') setFromCurrency(currency);
    else if (showSelector === 'to') setToCurrency(currency);
    setShowSelector(null);
  };

  const handleConfirm = () => {
    setStep('processing');
    setTransactionId('ZRH-' + Math.random().toString(36).substring(2, 10).toUpperCase());
    
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  const zerahFee = numericValue * ZERAH_FEE_PERCENT;
  const netAmount = numericValue - zerahFee;
  const calculatedValue = (netAmount * (fromCurrency.code === toCurrency.code ? 1 : exchangeRate)).toFixed(2);

  const renderCurrencySelector = (selected: CurrencyOption, type: 'from' | 'to') => (
    <div 
      onClick={() => setShowSelector(type)}
      className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 p-2 rounded-[24px] cursor-pointer active:scale-95 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 shadow-sm"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 border-white/20 shadow-inner shrink-0 bg-background-light dark:bg-background-dark">
        <img src={selected.flagUrl} alt={selected.code} className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center gap-1.5 pr-2">
        <span className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">
          {selected.code}
        </span>
        <span className="text-xs font-black text-primary/60">{selected.symbol}</span>
      </div>
      <span className="material-icons-round text-slate-400 text-lg mr-1 shrink-0">expand_more</span>
    </div>
  );

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark p-6">
        <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-4 border-white/5 border-b-primary/40 animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-icons-round text-primary text-4xl">sync</span>
            </div>
        </div>
        <h2 className="text-xl font-bold mb-2 animate-pulse uppercase tracking-[0.2em]">Processing</h2>
        <p className="text-slate-400 text-sm max-w-[200px] text-center">Finalizing your currency swap at the best market rate...</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark p-6 z-10 animate-in fade-in duration-700">
        <div className="flex-1 flex flex-col items-center pt-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 mb-6 animate-in zoom-in duration-500 delay-200">
            <span className="material-icons-round text-background-dark text-4xl">check</span>
          </div>
          <h2 className="text-2xl font-black mb-1">Conversion Successful!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-10">Funds added to your {toCurrency.code} wallet.</p>

          <div className="w-full bg-white dark:bg-surface-dark rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 relative">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background-light dark:bg-background-dark z-20 shadow-inner"></div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background-light dark:bg-background-dark z-20 shadow-inner"></div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6nUcfd4IketzNuR6aBfGSjjVjLc54Um9uCNVrS07a_3jO3f_TKXJxFpyJOqWZYpitye0S3KArDO-_MsSA9QIpIRZutK4T151eNOUHDtiqLp1gWMjI3oKFKTlqQOSFrS7_zsbVLyorB83fl2GXm-IpyYZliOXd4lYy521DwcfN8YEWFK3B5j1PB65OCgUxfl2h03B3xYE-rNHcJpcveEssEf5rHxTusH9FSnzxbLkpHi0iXbsu6g9CO5a2QQp2Ya5cfSGP5VcJq63U" className="w-6 h-6" alt="Zerah" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Zerah Transaction</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{new Date().toLocaleDateString()}</span>
              </div>

              <div className="flex flex-col items-center mb-6">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Total Received</p>
                <h3 className="text-4xl font-black text-primary">{toCurrency.symbol}{calculatedValue}</h3>
              </div>

              <div className="border-t-2 border-dashed border-slate-100 dark:border-white/10 my-6"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono font-bold">{transactionId}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">From</span>
                  <div className="flex items-center gap-2">
                    <img src={fromCurrency.flagUrl} alt="" className="w-4 h-3 rounded-sm" />
                    <span className="font-bold">{fromCurrency.code} ({fromCurrency.symbol}{numericValue.toLocaleString()})</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">To</span>
                  <div className="flex items-center gap-2">
                    <img src={toCurrency.flagUrl} alt="" className="w-4 h-3 rounded-sm" />
                    <span className="font-bold">{toCurrency.code} ({toCurrency.symbol}{calculatedValue})</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Rate</span>
                  <span className="font-bold">1 {fromCurrency.code} = {exchangeRate.toFixed(4)} {toCurrency.code}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Fee</span>
                  <span className="font-bold text-primary">{fromCurrency.symbol}{zerahFee.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-white/5 p-4 flex items-center justify-center gap-2">
               <span className="material-icons-round text-sm text-green-500">verified</span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Settled Instantly</span>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-4 pb-8">
          <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 py-4 rounded-[24px] font-bold active:scale-95 transition-all">
            <span className="material-icons-round">download</span>
            <span>Download Receipt</span>
          </button>
          <button 
            onClick={onBack}
            className="w-full bg-primary text-background-dark py-5 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20 uppercase tracking-widest active:scale-95 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark relative">
      <div className="absolute inset-0 pattern-overlay pointer-events-none"></div>

      <header className="px-6 py-4 flex items-center justify-between z-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 dark:bg-white/10 active:scale-90 transition-all"
        >
          <span className="material-icons-round text-lg">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
            <h1 className="text-lg font-bold tracking-tight">Convert</h1>
            <div className="flex items-center justify-center flex-col mt-0.5">
                <div className="flex items-center justify-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isLoadingRate ? 'bg-amber-500 animate-ping' : 'bg-green-500'}`}></span>
                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                        {lastUpdated || 'Updating...'}
                    </span>
                </div>
                {sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1 justify-center max-w-[150px]">
                    {sources.map((s, i) => (
                      <a 
                        key={i} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[8px] text-primary hover:underline truncate max-w-[60px]"
                        title={s.title}
                      >
                        Source {i + 1}
                      </a>
                    ))}
                  </div>
                )}
            </div>
        </div>
        <button 
            onClick={fetchLiveRate}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-slate-200/50 dark:bg-white/10 active:rotate-180 transition-all duration-500 ${isLoadingRate ? 'animate-spin' : ''}`}
        >
          <span className="material-icons-round text-lg">refresh</span>
        </button>
      </header>

      <main className="flex-1 px-6 pt-2 z-10 flex flex-col">
        {/* You Send */}
        <div className="bg-white/50 dark:bg-surface-dark border border-slate-200 dark:border-white/5 p-5 rounded-[32px] mb-3 backdrop-blur-sm transition-all group focus-within:ring-2 ring-primary/20">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">From</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic">Bal: {fromCurrency.symbol}1,240,000</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            {renderCurrencySelector(fromCurrency, 'from')}
            <div className="flex-1 text-right text-4xl font-black tracking-tighter text-slate-900 dark:text-white overflow-hidden whitespace-nowrap">
              {inputValue}<span className="text-primary animate-pulse">|</span>
            </div>
          </div>
        </div>

        {/* Swap Button Area */}
        <div className="flex justify-center -my-6 relative z-20">
          <button 
            onClick={handleSwapCurrencies}
            className="bg-primary text-background-dark w-12 h-12 rounded-[20px] flex items-center justify-center shadow-xl border-4 border-background-light dark:border-background-dark active:rotate-180 transition-all duration-300 cursor-pointer group"
          >
            <span className="material-icons-round font-bold group-hover:scale-110 transition-transform">swap_vert</span>
          </button>
        </div>

        {/* They Receive */}
        <div className="bg-white/50 dark:bg-surface-dark border border-slate-200 dark:border-white/5 p-5 rounded-[32px] pt-8 backdrop-blur-sm shadow-sm transition-all group focus-within:ring-2 ring-primary/20">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">To</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-[9px] text-primary font-bold uppercase tracking-wider">
                  1 {fromCurrency.code} = {exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toCurrency.code}
                </span>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            {renderCurrencySelector(toCurrency, 'to')}
            <div className="flex-1 text-right text-4xl font-black tracking-tighter text-slate-400 dark:text-slate-500/50 overflow-hidden whitespace-nowrap">
              {calculatedValue}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
            <div className="p-5 rounded-[28px] bg-white/30 dark:bg-white/5 border border-slate-200 dark:border-white/5 backdrop-blur-md">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-1">Details</h4>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                        <span className="font-bold">{fromCurrency.symbol}{numericValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 dark:text-slate-400">Fee (0.1%)</span>
                        </div>
                        <span className="font-bold text-primary">{fromCurrency.symbol}{zerahFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-white/10 my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Net Amount</span>
                        <span className="text-lg font-black text-primary">{toCurrency.symbol}{calculatedValue}</span>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <div className="px-6 pb-6 pt-4 z-10 bg-background-light dark:bg-background-dark">
        <div className="grid grid-cols-3 gap-y-1 gap-x-4 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
            <button 
              key={key}
              onClick={() => handleKeyPress(key)}
              className="h-12 text-2xl font-bold flex items-center justify-center rounded-2xl hover:bg-slate-200/50 dark:hover:bg-white/5 active:bg-primary/20 active:scale-95 transition-all text-slate-900 dark:text-white"
            >
              {key === 'backspace' ? (
                <span className="material-icons-round">backspace</span>
              ) : key}
            </button>
          ))}
        </div>
        <button 
          onClick={handleConfirm}
          disabled={numericValue <= 0}
          className="w-full bg-primary hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:grayscale transition-all text-background-dark font-black py-5 rounded-[24px] text-lg shadow-xl shadow-primary/20 uppercase tracking-widest flex items-center justify-center gap-3"
        >
          <span>Confirm swap</span>
          <span className="material-icons-round">arrow_forward</span>
        </button>
      </div>

      {showSelector && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4">
          <div 
            className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowSelector(null)}
          ></div>
          <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[40px] p-6 relative z-10 animate-in slide-in-from-bottom-20 duration-500 ease-out shadow-2xl">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-lg font-bold">Select Currency</h3>
              <button 
                onClick={() => setShowSelector(null)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full"
              >
                <span className="material-icons-round text-slate-400">close</span>
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto hide-scrollbar px-1">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => selectCurrency(c)}
                  className={`w-full flex items-center justify-between p-4 rounded-[24px] transition-all border-2 ${
                    (showSelector === 'from' ? fromCurrency.code === c.code : toCurrency.code === c.code)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-slate-50 dark:bg-white/5 border-transparent hover:border-slate-200 dark:hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-sm border border-white/10 shrink-0 bg-background-light dark:bg-background-dark">
                      <img src={c.flagUrl} alt={c.code} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-lg uppercase tracking-tight">{c.code}</p>
                        <p className="font-black text-primary/60 text-sm">{c.symbol}</p>
                      </div>
                    </div>
                  </div>
                  {(showSelector === 'from' ? fromCurrency.code === c.code : toCurrency.code === c.code) && (
                    <span className="material-icons-round text-primary">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Convert;
