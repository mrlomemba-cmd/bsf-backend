import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Globe, Shield, Upload, QrCode } from 'lucide-react';
import { BSFLogo } from '../ui/BSFLogo';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <BSFLogo size="sm" />
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              {t('home.subheadline')}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-[0.2em] text-white/40 uppercase">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Globe size={13} />
                {t('nav.home')}
              </Link>
              <Link
                to="/upload"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Upload size={13} />
                {t('nav.files')}
              </Link>
              <Link
                to="/qr"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <QrCode size={13} />
                {t('nav.scanQR')}
              </Link>
              <Link
                to="/admin/login"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Shield size={13} />
                {t('nav.admin')}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-[0.2em] text-white/40 uppercase">
              {t('home.contactInfo')}
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+243832753325"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Phone size={13} />
                +243 832 753 325
              </a>
              <a
                href="mailto:banquesololaforever@gmail.com"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Globe size={13} />
                banquesololaforever.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">{t('home.footer')}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/20">
              Powered by QYROVA Multiservice
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
