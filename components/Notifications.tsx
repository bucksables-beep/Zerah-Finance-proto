
import React, { useState } from 'react';

interface NotificationsProps {
  onBack: () => void;
}

interface NotificationItem {
  id: string;
  type: 'transaction' | 'security' | 'engine' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'transaction',
    title: 'Incoming Transfer',
    body: 'You received $4,500.00 from Zerah Global Trust. Check your USD wallet for details.',
    time: '2m ago',
    read: false,
    icon: 'arrow_downward'
  },
  {
    id: '2',
    type: 'security',
    title: 'Security Alert',
    body: 'A new login was detected on your account from London, UK. If this wasn\'t you, please secure your account.',
    time: '1h ago',
    read: false,
    icon: 'security'
  },
  {
    id: '3',
    type: 'engine',
    title: 'Engine Pro Active',
    body: 'Welcome to Zerah Engine Pro! Your high-performance business tools are now ready for use.',
    time: '5h ago',
    read: true,
    icon: 'bolt'
  },
  {
    id: '4',
    type: 'system',
    title: 'Rate Update',
    body: 'GBP/USD rates have improved. Lock in your rate now using FX Hedging.',
    time: 'Yesterday',
    read: true,
    icon: 'trending_up'
  },
  {
    id: '5',
    type: 'transaction',
    title: 'Payment Sent',
    body: 'Success! Your payment of £250.00 to Stark Industries has been settled.',
    time: 'Yesterday',
    read: true,
    icon: 'send'
  }
];

const Notifications: React.FC<NotificationsProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIconColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'transaction': return 'bg-primary/10 text-primary';
      case 'security': return 'bg-red-500/10 text-red-500';
      case 'engine': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-slate-100 dark:bg-white/5 text-slate-400';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="px-6 pt-12 pb-6 flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-white/5 shadow-sm border border-slate-200 dark:border-white/5 active:scale-90 transition-all"
          >
            <span className="material-icons-round text-lg">arrow_back</span>
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] animate-pulse">
                {unreadCount} Unread Alerts
              </p>
            )}
          </div>
          <button 
            onClick={markAllRead}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors disabled:opacity-30"
            disabled={unreadCount === 0}
          >
            Clear All
          </button>
        </div>

        <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
          {['All', 'Alerts', 'Activity'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === 'All' ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' : 'text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 flex-1 space-y-8 pb-12 overflow-y-auto">
        {/* Today Group */}
        <section className="animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Today</h3>
          <div className="space-y-3">
            {notifications.filter(n => !n.time.includes('Yesterday')).map((n, idx) => (
              <div 
                key={n.id} 
                className={`p-5 rounded-[28px] border transition-all relative overflow-hidden group ${
                  n.read ? 'bg-white/40 dark:bg-surface-dark/20 border-slate-200 dark:border-white/5 opacity-70' : 'bg-white dark:bg-surface-dark border-primary/20 shadow-xl shadow-primary/5'
                }`}
              >
                {!n.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(183,204,22,0.8)]"></div>
                )}
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${getIconColor(n.type)}`}>
                    <span className="material-icons-round text-xl">{n.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm leading-tight">{n.title}</h4>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap ml-2">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Yesterday Group */}
        <section className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Earlier</h3>
          <div className="space-y-3">
            {notifications.filter(n => n.time.includes('Yesterday')).map((n) => (
              <div 
                key={n.id} 
                className={`p-5 rounded-[28px] border transition-all flex gap-4 ${
                  n.read ? 'bg-white/40 dark:bg-surface-dark/20 border-slate-200 dark:border-white/5 opacity-60' : 'bg-white dark:bg-surface-dark border-primary/20 shadow-lg'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getIconColor(n.type)}`}>
                  <span className="material-icons-round text-xl">{n.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm leading-tight">{n.title}</h4>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-2">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {n.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-8 text-center">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 opacity-30">
              End of Notifications
           </p>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
