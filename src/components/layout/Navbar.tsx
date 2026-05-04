import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, QrCode, LogOut, Shield } from 'lucide-react';
import { BSFLogo } from '../ui/BSFLogo';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../utils/cn';

export function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/upload', label: t('nav.files') },
    { path: '/qr', label: t('nav.scanQR') },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
            <BSFLogo size="sm" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors duration-200',
                  isActive(path)
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="text-xs font-semibold tracking-wider text-white/50 hover:text-white transition-colors px-3 py-1.5 border border-white/20 hover:border-white/50"
            >
              {language === 'fr' ? 'EN' : 'FR'}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Shield size={14} />
                  {t('admin.adminPanel')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
                >
                  <LogOut size={14} />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-white text-black hover:bg-gray-100 transition-colors"
              >
                <Shield size={14} />
                {t('nav.admin')}
              </Link>
            )}

            {/* QR icon */}
            <Link
              to="/qr"
              className="p-2 text-white/50 hover:text-white transition-colors"
              title={t('nav.scanQR')}
            >
              <QrCode size={18} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-3 text-sm font-medium transition-colors',
                  isActive(path)
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                {label}
              </Link>
            ))}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => { toggleLanguage(); setMobileOpen(false); }}
                className="text-xs font-semibold tracking-wider text-white/50 hover:text-white transition-colors px-3 py-1.5 border border-white/20"
              >
                {language === 'fr' ? 'Switch to EN' : 'Passer en FR'}
              </button>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
                >
                  <LogOut size={14} />
                  {t('nav.logout')}
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-white text-black"
                >
                  <Shield size={14} />
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
