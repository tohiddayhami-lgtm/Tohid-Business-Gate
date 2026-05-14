import * as React from 'react';
import { useState } from 'react';
import { auth, db } from '@/src/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslation } from '@/src/hooks/useLocale';

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        role: 'customer',
        createdAt: new Date().toISOString()
      }, { merge: true });
      toast.success(t('auth_toast_welcome'));
      onClose();
    } catch (e) {
      toast.error(t('auth_toast_google_err'));
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          email: res.user.email,
          role: 'customer',
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      toast.success(t('auth_toast_ok'));
      onClose();
    } catch (e) {
      toast.error(t('auth_toast_err'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B5E3F]/40 backdrop-blur-md p-4 rtl fa">
      <Card className="max-w-md w-full glass-card rounded-[2.5rem] shadow-2xl relative border-2 border-white/50">
        <button onClick={onClose} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600">✕</button>
        <CardHeader className="text-center pt-10">
          <CardTitle className="text-3xl font-bold">
            {mode === 'login' ? t('auth_welcome') : t('auth_join', { brand: t('brand') })}
          </CardTitle>
          <CardDescription>{t('auth_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-12">
          <Button variant="outline" className="w-full h-12 rounded-xl flex gap-2 items-center justify-center" onClick={handleGoogle}>
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
            {t('auth_google')}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-400">{t('auth_or_email')}</span></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('auth_email')}</Label>
              <Input
                type="email"
                placeholder={t('auth_email_ph')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('auth_password')}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl ltr"
              />
            </div>
            <Button className="w-full h-14 rounded-2xl bg-[#1B5E3F] text-lg font-bold" disabled={loading}>
              {mode === 'login' ? t('auth_signin') : t('auth_signup')}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            {mode === 'login' ? t('auth_no_account') : t('auth_have_account')}{' '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-[#1B5E3F] font-bold">
              {mode === 'login' ? t('auth_signup_cta') : t('auth_login_cta')}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
