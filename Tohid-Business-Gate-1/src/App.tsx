/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/useAuthStore';
import { useTranslation } from './hooks/useLocale';
import { Toaster } from '@/components/ui/sonner';
import RegistrationWizard from './components/RegistrationWizard';
import { AuthModal } from './components/AuthModal';
import LiveChat from './components/LiveChat';
import { Building2, Car, Hotel, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import './i18n';

// Dummy Dashboard Component for now
const Dashboard = () => {
  const { t, isRtl } = useTranslation();
  return (
    <div className={`p-8 max-w-7xl mx-auto ${isRtl ? 'rtl fa' : 'ltr en'}`}>
      <h1 className="text-3xl font-bold mb-8">{t('nav_dashboard')}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <p className="text-slate-400 text-sm uppercase font-bold">Active Applications</p>
           <p className="text-4xl font-bold mt-2">1</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <p className="text-slate-400 text-sm uppercase font-bold">Pending Actions</p>
           <p className="text-4xl font-bold mt-2">2</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <p className="text-slate-400 text-sm uppercase font-bold">Support Chats</p>
           <p className="text-4xl font-bold mt-2 text-primary">0</p>
        </div>
      </div>
      
      <div className="mt-12 bg-white rounded-3xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
           <h2 className="font-bold text-lg">Recent Applications</h2>
           <button className="text-primary text-sm font-bold">View All</button>
        </div>
        <div className="p-8 text-center text-slate-400">
           You have no complex applications yet. Start by registering a company!
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const { user, setUser } = useAuthStore();
  const { t, isRtl, toggleLanguage, currentLang } = useTranslation();
  const [showWizard, setShowWizard] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  const handleLogout = () => signOut(auth);

  if (showWizard) {
    return (
      <div className={`min-h-screen bg-slate-50 ${isRtl ? 'rtl fa' : 'ltr en'}`}>
        <header className="glass-nav h-16 flex items-center px-4 sm:px-8 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowWizard(false)}
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl leading-none">OmanGate</span>
                <span className="text-secondary text-[10px] font-medium tracking-widest uppercase">بوابة عمان</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleLanguage}
                className="text-xs font-bold text-white/80 uppercase bg-white/10 px-4 py-1.5 rounded-full hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm"
              >
                {currentLang === 'en' ? 'FA' : 'EN'}
              </button>
            </div>
          </div>
        </header>
        <div className="relative">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -z-10" />
          <RegistrationWizard />
        </div>
        <Toaster position="top-right" />
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isRtl ? 'rtl fa' : 'ltr en'}`}>
      <header className="glass-nav h-20 sticky top-0 z-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowDashboard(false)}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-primary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-none">{t('brand')}</span>
              <span className="text-secondary text-[10px] font-medium tracking-widest uppercase">Oman Services</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/90">
            <a href="#services" className="hover:text-secondary transition-colors">{t('nav_services')}</a>
            <a href="#pricing" className="hover:text-secondary transition-colors">{t('nav_pricing')}</a>
            {user && (
              <button 
                onClick={() => setShowDashboard(true)}
                className={`hover:text-secondary transition-colors ${showDashboard ? 'text-secondary font-bold' : ''}`}
              >
                {t('nav_dashboard')}
              </button>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold text-white border border-white/20 hover:bg-white/20 transition-colors uppercase backdrop-blur-sm"
            >
              {currentLang === 'en' ? 'FA' : 'EN'}
            </button>
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border-2 border-white/20 shadow-lg">
                   {user.photoURL ? <img src={user.photoURL} alt="p" className="w-full h-full object-cover rounded-full" /> : <span className="text-white font-bold">{user.displayName?.charAt(0) || 'U'}</span>}
                </div>
                <button onClick={handleLogout} className="text-[10px] font-bold text-white/60 hover:text-white transition-colors">LOGOUT</button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuth(true)}
                className="bg-secondary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-secondary/20 hover:scale-105 transition-all"
              >
                {t('nav_login')}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow bg-slate-50">
        {showDashboard ? (
          <Dashboard />
        ) : (
          <section className="relative pt-20 pb-32 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center md:text-left">
              <div className={`max-w-2xl ${isRtl ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                  {t('hero_title')}
                </h1>
                <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-xl">
                  {t('hero_subtitle')}
                </p>
                <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
                  <button 
                    onClick={() => setShowWizard(true)}
                    className="bg-primary text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-transform"
                  >
                    {t('cta_start')}
                  </button>
                  <button className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-colors">
                    {t('cta_learn_more')}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl -z-10" />
          </section>
        )}

        {/* Services Section */}
        {!showDashboard && !showWizard && (
          <section id="services" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold">{t('nav_services')}</h2>
                <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { name: 'company_reg', icon: Building2, active: true },
                  { name: 'car_rental', icon: Car, active: false },
                  { name: 'hostels', icon: Hotel, active: false },
                  { name: 'real_estate', icon: LayoutDashboard, active: false },
                ].map((s) => (
                  <Card key={s.name} className="p-8 rounded-[2rem] glass-card border-2 hover:-translate-y-2 transition-all cursor-pointer relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform scale-150">
                      <s.icon size={64} />
                    </div>
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${s.active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <s.icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">{t(s.name)}</h3>
                      {!s.active && <Badge variant="secondary" className="mt-3 bg-slate-100 text-slate-400 border-none px-3 py-1">{t('coming_soon')}</Badge>}
                      {s.active && (
                        <button 
                          onClick={() => setShowWizard(true)}
                          className="mt-6 text-primary font-bold text-sm flex items-center gap-2 group underline underline-offset-4 decoration-secondary"
                        >
                           {t('cta_start')}
                           <ArrowRight size={16} className={`${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                        </button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="max-w-xs">
              <span className="text-2xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">O</div>
                {t('brand')}
              </span>
              <p className="mt-4 text-slate-400 text-sm">
                {t('footer_disclaimer')}
              </p>
            </div>
            <div className="flex gap-16">
              <div className="flex flex-col gap-4">
                <span className="font-bold">{t('nav_services')}</span>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">{t('company_reg')}</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold">Support</span>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <Toaster position="top-right" />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <LiveChat />
    </div>
  );
}

