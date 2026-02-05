
import React from 'react';

interface ProfileProps {
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const sections = [
    {
      title: 'Account Settings',
      items: [
        { icon: 'person_outline', label: 'Personal Information', sub: 'Update your details' },
        { icon: 'account_balance', label: 'Beneficiaries', sub: 'Manage saved recipients' },
        { icon: 'description', label: 'Statements', sub: 'Download financial records' },
      ]
    },
    {
      title: 'Security & Privacy',
      items: [
        { icon: 'lock_outline', label: 'Change Security PIN', sub: 'Update 4-digit code' },
        { icon: 'fingerprint', label: 'Biometric Login', sub: 'Face ID / Fingerprint', toggle: true },
        { icon: 'shield', label: 'Two-Factor Auth', sub: 'Add extra protection' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'notifications_none', label: 'Notifications', sub: 'Manage alerts & emails' },
        { icon: 'language', label: 'Language', sub: 'English (US)' },
        { icon: 'support_agent', label: 'Help & Support', sub: 'Contact our team' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header */}
      <header className="px-6 pt-12 pb-8 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-white/5 shadow-sm border border-slate-200 dark:border-white/5 active:scale-90 transition-all z-20"
        >
          <span className="material-icons-round text-lg">arrow_back</span>
        </button>

        <div className="relative mb-6 z-10">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary via-primary/50 to-transparent shadow-2xl">
            <div className="w-full h-full rounded-full border-4 border-background-light dark:border-background-dark overflow-hidden bg-surface-dark">
              <img 
                alt="Alex Thompson" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200&h=200"
              />
            </div>
          </div>
          <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-background-light dark:border-background-dark text-background-dark shadow-lg">
            <span className="material-icons-round text-sm">verified</span>
          </div>
        </div>

        <div className="z-10">
          <h2 className="text-2xl font-black tracking-tight mb-1">Alex Thompson</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">alex.thompson@zerah.io</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
             <span className="material-icons-round text-xs text-primary">bolt</span>
             <span className="text-[9px] font-black uppercase tracking-widest text-primary">Engine Pro Member</span>
          </div>
        </div>
      </header>

      {/* Settings Sections */}
      <main className="px-6 flex-1 space-y-8 pb-12">
        {sections.map((section, idx) => (
          <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 px-2">{section.title}</h3>
            <div className="bg-white dark:bg-surface-dark/40 border border-slate-200 dark:border-white/5 rounded-[32px] overflow-hidden shadow-sm">
              {section.items.map((item, i) => (
                <button 
                  key={i} 
                  className={`w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b last:border-0 border-slate-100 dark:border-white/5 text-left group`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <span className="material-icons-round text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.label}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{item.sub}</p>
                    </div>
                  </div>
                  {item.toggle ? (
                    <div className="w-10 h-6 bg-primary rounded-full relative">
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  ) : (
                    <span className="material-icons-round text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full bg-white dark:bg-surface-dark border border-red-500/10 dark:border-red-500/20 py-5 rounded-[28px] flex items-center justify-center gap-3 text-red-500 font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-red-500/5">
           <span className="material-icons-round text-lg">logout</span>
           <span>Log Out of Session</span>
        </button>
        
        <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 opacity-50">
           Zerah Finance v2.4.0 • Build 829
        </p>
      </main>
    </div>
  );
};

export default Profile;
