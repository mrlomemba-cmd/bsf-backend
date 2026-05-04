import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Upload,
  QrCode,
  ShieldCheck,
  Zap,
  UserX,
  FileImage,
  FileText,
  File,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { BSFLogo } from '../components/ui/BSFLogo';
import { Button } from '../components/ui/Button';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: ShieldCheck,
      label: t('home.feat1'),
      desc: 'Chiffrement de bout en bout',
    },
    {
      icon: Zap,
      label: t('home.feat2'),
      desc: 'Envoi instantané',
    },
    {
      icon: UserX,
      label: t('home.feat3'),
      desc: 'Aucune inscription requise',
    },
    {
      icon: QrCode,
      label: t('home.feat4'),
      desc: 'Accès via QR Code',
    },
  ];

  const steps = [
    {
      number: '01',
      icon: Upload,
      title: t('home.step1Title'),
      desc: t('home.step1Desc'),
    },
    {
      number: '02',
      icon: ShieldCheck,
      title: t('home.step2Title'),
      desc: t('home.step2Desc'),
    },
    {
      number: '03',
      icon: File,
      title: t('home.step3Title'),
      desc: t('home.step3Desc'),
    },
  ];

  const formats = [
    { icon: FileImage, label: 'Image', types: 'JPG, PNG, GIF, WebP' },
    { icon: FileText, label: 'PDF', types: 'Adobe PDF' },
    { icon: File, label: 'Documents', types: 'DOC, DOCX, XLS, TXT' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* ─── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          {/* Logo */}
          <BSFLogo size="xl" className="mb-4" />

          {/* Headline */}
          <div className="space-y-4">
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {t('home.headline')}
            </h1>
            <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto font-light">
              {t('home.subheadline')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/upload')}
              className="group"
            >
              <Upload size={18} />
              {t('home.uploadBtn')}
              <ArrowRight
                size={16}
                className="ml-1 group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/qr')}
            >
              <QrCode size={18} />
              {t('home.scanBtn')}
            </Button>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown size={20} className="text-white/30" />
          </div>
        </div>
      </section>

      {/* ─── Supported Formats ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-semibold tracking-[0.3em] text-white/30 uppercase text-center mb-10">
            {t('home.supportedFormats')}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {formats.map(({ icon: Icon, label, types }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 p-6 border border-white/10 hover:border-white/30 transition-colors group"
              >
                <div className="p-3 bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Icon size={24} className="text-white/70" />
                </div>
                <span className="font-semibold text-white text-sm">{label}</span>
                <span className="text-xs text-white/30 text-center">{types}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {t('home.howItWorks')}
            </h2>
            <div className="mt-3 w-12 h-px bg-white/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ number, icon: Icon, title, desc }, i) => (
              <div key={number} className="relative flex flex-col gap-4">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%_-_16px)] w-full h-px bg-white/10 z-0" />
                )}
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl font-black text-white/10 tabular-nums">
                      {number}
                    </span>
                    <div className="p-3 bg-white/5 border border-white/10">
                      <Icon size={20} className="text-white/70" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {t('home.featuresTitle')}
            </h2>
            <div className="mt-3 w-12 h-px bg-white/30 mx-auto" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/[0.02] group"
              >
                <div className="mb-4 inline-flex p-2.5 bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">
                  {label}
                </h3>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-zinc-950 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {t('home.uploadBtn')} →
          </h2>
          <p className="text-white/40 mb-8">{t('home.subheadline')}</p>
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/upload')}
          >
            <Upload size={18} />
            {t('home.uploadBtn')}
          </Button>
        </div>
      </section>
    </div>
  );
}
