import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import { Download, Copy, QrCode, ExternalLink } from 'lucide-react';
import { BSFLogo } from '../components/ui/BSFLogo';
import { Button } from '../components/ui/Button';

export function QRPage() {
  const { t } = useTranslation();
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // The upload page URL – update for production deployment
  const uploadUrl = `${window.location.origin}/upload`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(uploadUrl);
      setCopied(true);
      toast.success(t('qr.copied'));
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'BSF-QRCode-Upload.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t('qr.downloadQR'));
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12 pt-24">
      <div className="w-full max-w-md text-center">
        {/* Header */}
        <BSFLogo size="md" className="mb-8 mx-auto" />

        <div className="flex items-center justify-center gap-2 mb-2">
          <QrCode size={20} className="text-white/60" />
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {t('qr.title')}
          </h1>
        </div>
        <p className="text-white/40 text-sm mb-10">{t('qr.subtitle')}</p>

        {/* QR Code Card */}
        <div className="border border-white/20 bg-zinc-950 p-8 mb-6">
          {/* QR code with BSF branding */}
          <div
            ref={qrRef}
            className="inline-flex p-4 bg-white"
          >
            <QRCodeCanvas
              value={uploadUrl}
              size={220}
              level="H"
              bgColor="#FFFFFF"
              fgColor="#000000"
              marginSize={1}
              imageSettings={{
                src: '/bsf-logo.png',
                height: 44,
                width: 44,
                excavate: true,
              }}
            />
          </div>

          {/* Upload URL */}
          <div className="mt-6 px-4 py-3 bg-black border border-white/10 text-left">
            <p className="text-xs text-white/30 mb-1 uppercase tracking-widest">URL</p>
            <p className="text-xs font-mono text-white/60 break-all">{uploadUrl}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            fullWidth
            size="md"
            onClick={handleDownloadQR}
          >
            <Download size={16} />
            {t('qr.downloadQR')}
          </Button>

          <Button
            variant="secondary"
            fullWidth
            size="md"
            onClick={handleCopyLink}
          >
            <Copy size={16} />
            {copied ? t('qr.copied') : t('qr.shareLink')}
          </Button>

          <Button
            variant="ghost"
            fullWidth
            size="md"
            onClick={() => window.open(uploadUrl, '_blank')}
          >
            <ExternalLink size={16} />
            {t('nav.files')}
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-left border border-white/10 p-5">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-white/30 uppercase mb-4">
            Instructions
          </h3>
          <ol className="space-y-3">
            {[
              'Ouvrez l\'appareil photo de votre téléphone / Open your phone camera',
              'Pointez vers le QR Code / Point at the QR Code',
              'Appuyez sur le lien / Tap the link',
              'Uploadez votre fichier / Upload your file',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-white/40">
                <span className="shrink-0 w-5 h-5 flex items-center justify-center border border-white/20 text-white/30 font-mono text-[10px]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
