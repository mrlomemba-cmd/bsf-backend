import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Shield, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BSFLogo } from '../../components/ui/BSFLogo';
import { Button } from '../../components/ui/Button';

export function AdminLoginPage() {
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    '/admin/dashboard';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (!email.trim() || !password) {
      setFieldError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      navigate(from, { replace: true });
    } catch {
      const msg = t('admin.loginError');
      setFieldError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <BSFLogo size="md" className="mb-6 mx-auto" />
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield size={16} className="text-white/50" />
            <h1
              className="text-xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {t('admin.loginTitle')}
            </h1>
          </div>
          <p className="text-white/40 text-sm">{t('admin.loginSubtitle')}</p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="border border-white/15 bg-zinc-950 p-8 space-y-5"
          noValidate
        >
          {/* Email field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-semibold tracking-wider text-white/40 uppercase"
            >
              {t('admin.email')}
            </label>
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@bsf.com"
                className="
                  w-full bg-black border border-white/15 text-white text-sm
                  pl-9 pr-4 py-3 placeholder:text-white/20
                  focus:outline-none focus:border-white/50
                  transition-colors
                "
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-xs font-semibold tracking-wider text-white/40 uppercase"
            >
              {t('admin.password')}
            </label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="
                  w-full bg-black border border-white/15 text-white text-sm
                  pl-9 pr-10 py-3 placeholder:text-white/20
                  focus:outline-none focus:border-white/50
                  transition-colors
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {fieldError && (
            <div className="flex items-center gap-2 p-3 border border-red-500/30 bg-red-950/20">
              <Shield size={14} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{fieldError}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="md"
            loading={loading}
          >
            <Shield size={16} />
            {loading ? t('admin.loggingIn') : t('admin.loginBtn')}
          </Button>

          {/* Demo hint */}
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/20 text-center">
              Demo: admin@bsf.com / BSF@Admin2024!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
