import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  Upload,
  CheckCircle,
  XCircle,
  FileImage,
  FileText,
  File,
  X,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { BSFLogo } from '../components/ui/BSFLogo';
import { uploadFile } from '../services/storageService';
import { validateFile, formatFileSize, ALLOWED_MIME_TYPES } from '../utils/fileUtils';
import type { UploadState } from '../types';

const INITIAL_STATE: UploadState = {
  status: 'idle',
  progress: 0,
  file: null,
  error: null,
  uploadedFile: null,
};

function getFileIconComponent(mimeType: string) {
  if (mimeType.startsWith('image/')) return FileImage;
  if (mimeType === 'application/pdf') return FileText;
  return File;
}

export function UploadPage() {
  const { t } = useTranslation();
  const [uploadState, setUploadState] = useState<UploadState>(INITIAL_STATE);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const validation = validateFile(file);
      if (!validation.valid) {
        const errorMsg =
          validation.error === 'size'
            ? t('upload.errorSize')
            : t('upload.errorType');
        toast.error(errorMsg);
        setUploadState((prev) => ({ ...prev, error: errorMsg }));
        return;
      }

      setUploadState({
        status: 'idle',
        progress: 0,
        file,
        error: null,
        uploadedFile: null,
      });
    },
    [t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    maxSize: 10 * 1024 * 1024,
    accept: ALLOWED_MIME_TYPES.reduce<Record<string, string[]>>(
      (acc, mime) => ({ ...acc, [mime]: [] }),
      {}
    ),
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error(t('upload.errorSize'));
      } else {
        toast.error(t('upload.errorType'));
      }
    },
  });

  const handleUpload = async () => {
    if (!uploadState.file) return;

    setUploadState((prev) => ({ ...prev, status: 'uploading', progress: 0 }));

    try {
      const uploaded = await uploadFile(uploadState.file, (progress) => {
        setUploadState((prev) => ({ ...prev, progress }));
      });

      setUploadState((prev) => ({
        ...prev,
        status: 'success',
        progress: 100,
        uploadedFile: uploaded,
      }));
      toast.success(t('upload.successTitle'));
    } catch {
      const errorMsg = t('upload.errorUpload');
      setUploadState((prev) => ({
        ...prev,
        status: 'error',
        error: errorMsg,
      }));
      toast.error(errorMsg);
    }
  };

  const handleReset = () => {
    setUploadState(INITIAL_STATE);
  };

  const handleRemoveFile = () => {
    setUploadState(INITIAL_STATE);
  };

  const { file, status, progress, error } = uploadState;
  const FileIcon = file ? getFileIconComponent(file.type) : Upload;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 pt-24">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="text-center mb-10">
            <BSFLogo size="md" className="mb-6 mx-auto" />
            <h1
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {t('upload.title')}
            </h1>
            <p className="text-white/40 mt-2 text-sm">{t('upload.subtitle')}</p>
          </div>

          {/* ─── Success State ────────────────────────────────────────────── */}
          {status === 'success' && (
            <div className="border border-white/20 bg-zinc-950 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/10 flex items-center justify-center">
                  <CheckCircle size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                {t('upload.successTitle')}
              </h2>
              <p className="text-white/50 text-sm mb-2">
                {t('upload.successMsg')}
              </p>
              {uploadState.uploadedFile && (
                <p className="text-xs text-white/30 font-mono mb-6">
                  {uploadState.uploadedFile.originalName} —{' '}
                  {formatFileSize(uploadState.uploadedFile.size)}
                </p>
              )}
              <ProgressBar progress={100} className="mb-6" />
              <Button variant="secondary" onClick={handleReset} fullWidth>
                <RefreshCw size={16} />
                {t('upload.newUpload')}
              </Button>
            </div>
          )}

          {/* ─── Upload Interface ─────────────────────────────────────────── */}
          {status !== 'success' && (
            <>
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`
                  relative border-2 border-dashed transition-all duration-300 cursor-pointer
                  ${isDragActive
                    ? 'border-white bg-white/10 scale-[1.02]'
                    : file
                    ? 'border-white/40 bg-zinc-950'
                    : 'border-white/20 hover:border-white/50 bg-zinc-950 hover:bg-zinc-900'
                  }
                `}
              >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center gap-4 py-14 px-6 text-center">
                  {isDragActive ? (
                    <>
                      <div className="w-16 h-16 bg-white/20 flex items-center justify-center animate-pulse">
                        <Upload size={28} className="text-white" />
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {t('upload.dragActive')}
                      </p>
                    </>
                  ) : file ? (
                    <>
                      <div className="w-16 h-16 bg-white/10 flex items-center justify-center">
                        <FileIcon size={28} className="text-white/80" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm mb-1">
                          {file.name}
                        </p>
                        <p className="text-xs text-white/40">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white/5 flex items-center justify-center">
                        <Upload size={28} className="text-white/40" />
                      </div>
                      <div>
                        <p className="text-white/80 font-medium text-sm">
                          {t('upload.subtitle')}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {t('upload.browse')}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* File info bar */}
              {file && status !== 'uploading' && (
                <div className="mt-3 flex items-center justify-between px-4 py-3 bg-zinc-900 border border-white/10">
                  <div className="flex items-center gap-3">
                    <FileIcon size={16} className="text-white/50 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-white/80 truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-white/30">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="p-1 text-white/30 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Progress bar during upload */}
              {status === 'uploading' && (
                <div className="mt-4 space-y-2">
                  <ProgressBar
                    progress={progress}
                    label={t('upload.uploading')}
                    showPercentage
                  />
                </div>
              )}

              {/* Error message */}
              {error && status === 'error' && (
                <div className="mt-4 flex items-center gap-2 p-3 border border-red-500/30 bg-red-950/20">
                  <XCircle size={16} className="text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <div className="mt-6 space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  disabled={!file || status === 'uploading'}
                  loading={status === 'uploading'}
                  onClick={handleUpload}
                >
                  <Upload size={18} />
                  {status === 'uploading'
                    ? t('upload.uploading')
                    : t('upload.uploadBtn')}
                </Button>

                {error && (
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={handleReset}
                  >
                    <RefreshCw size={16} />
                    {t('common.retry')}
                  </Button>
                )}
              </div>

              {/* Constraints */}
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/25">
                <span>{t('upload.maxSize')}</span>
                <span>•</span>
                <span>{t('upload.allowedTypes')}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
