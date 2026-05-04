import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  Download,
  Trash2,
  RefreshCw,
  Search,
  Files,
  HardDrive,
  Clock,
  Shield,
  FileImage,
  FileText,
  File,
  AlertTriangle,
  LogOut,
  QrCode,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BSFLogo } from '../../components/ui/BSFLogo';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  getAllFiles,
  deleteFileById,
  downloadFile,
  getFileStats,
} from '../../services/storageService';
import {
  formatFileSize,
  formatDate,
  getFileTypeLabel,
} from '../../utils/fileUtils';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { UploadedFile, FileStats } from '../../types';

function FileRowIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith('image/'))
    return <FileImage size={16} className="text-white/50" />;
  if (mimeType === 'application/pdf')
    return <FileText size={16} className="text-white/50" />;
  return <File size={16} className="text-white/50" />;
}

export function AdminDashboard() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<UploadedFile[]>([]);
  const [stats, setStats] = useState<FileStats>({
    totalFiles: 0,
    totalSize: 0,
    lastUpload: null,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<UploadedFile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const locale = language === 'fr' ? 'fr-FR' : 'en-US';

  // ─── Load data ────────────────────────────────────────────────────────────
  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const [allFiles, fileStats] = await Promise.all([
        getAllFiles(),
        getFileStats(),
      ]);
      setFiles(allFiles);
      setFilteredFiles(allFiles);
      setStats(fileStats);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Search filter ────────────────────────────────────────────────────────
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredFiles(files);
    } else {
      setFilteredFiles(
        files.filter(
          (f) =>
            f.originalName.toLowerCase().includes(query) ||
            getFileTypeLabel(f.mimeType).toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, files]);

  // ─── Delete handler ───────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await deleteFileById(deleteTarget.id);
      setFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setStats((prev) => ({
        ...prev,
        totalFiles: prev.totalFiles - 1,
        totalSize: prev.totalSize - deleteTarget.size,
      }));
      toast.success(t('admin.deleteSuccess'));
      setDeleteTarget(null);
    } catch {
      toast.error(t('admin.deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = (file: UploadedFile) => {
    downloadFile(file);
    toast.success(`${file.originalName} — téléchargement démarré`);
  };

  const statCards = [
    {
      label: t('admin.filesUploaded'),
      value: stats.totalFiles.toString(),
      icon: Files,
    },
    {
      label: t('admin.totalSize'),
      value: formatFileSize(stats.totalSize),
      icon: HardDrive,
    },
    {
      label: t('admin.lastUpload'),
      value: stats.lastUpload
        ? formatDate(stats.lastUpload, locale)
        : '—',
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ─── Admin Sidebar / Top bar ────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <BSFLogo size="sm" />
            <div className="hidden sm:block">
              <p className="text-xs text-white/30 uppercase tracking-widest">
                {t('admin.adminPanel')}
              </p>
              <h1
                className="text-lg font-bold text-white"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {t('admin.dashboardTitle')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="text-xs font-semibold tracking-wider text-white/40 hover:text-white transition-colors px-3 py-1.5 border border-white/15 hover:border-white/40"
            >
              {language === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* QR Link */}
            <Link
              to="/qr"
              className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
            >
              <QrCode size={14} />
              QR Code
            </Link>

            {/* Refresh */}
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{t('admin.refresh')}</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-colors"
            >
              <LogOut size={13} />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── Stat Cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="border border-white/10 bg-zinc-950 p-5 flex items-center gap-4"
            >
              <div className="p-2.5 bg-white/5">
                <Icon size={18} className="text-white/60" />
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-0.5">
                  {label}
                </p>
                <p
                  className="text-xl font-bold text-white tabular-nums"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Files Table ─────────────────────────────────────────────── */}
        <div className="border border-white/10 bg-zinc-950">
          {/* Table header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-white/40" />
              <h2 className="font-semibold text-white text-sm">
                {t('admin.filesTable')}
              </h2>
              {!loading && (
                <span className="text-xs text-white/30 ml-1">
                  ({filteredFiles.length})
                </span>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('admin.searchFiles')}
                className="
                  w-full bg-black border border-white/15 text-white text-sm
                  pl-9 pr-4 py-2 placeholder:text-white/20
                  focus:outline-none focus:border-white/40
                  transition-colors
                "
              />
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-white/5 animate-pulse rounded-sm"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredFiles.length === 0 && (
            <div className="py-16 text-center">
              <Files size={36} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">
                {searchQuery ? 'Aucun résultat trouvé.' : t('admin.noFiles')}
              </p>
            </div>
          )}

          {/* File rows — responsive table */}
          {!loading && filteredFiles.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {[
                        t('admin.fileName'),
                        t('admin.fileType'),
                        t('admin.fileSize'),
                        t('admin.uploadDate'),
                        t('admin.actions'),
                      ].map((col) => (
                        <th
                          key={col}
                          className="px-6 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file, idx) => (
                      <tr
                        key={file.id}
                        className={`
                          border-b border-white/5 hover:bg-white/[0.03] transition-colors
                          ${idx % 2 === 0 ? '' : 'bg-white/[0.01]'}
                        `}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileRowIcon mimeType={file.mimeType} />
                            <span
                              className="text-white/80 font-medium truncate max-w-[200px]"
                              title={file.originalName}
                            >
                              {file.originalName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-0.5 text-xs border border-white/15 text-white/50">
                            {getFileTypeLabel(file.mimeType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/50 tabular-nums text-xs">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-6 py-4 text-white/40 text-xs">
                          {formatDate(file.uploadedAt, locale)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDownload(file)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-colors"
                              title={t('admin.download')}
                            >
                              <Download size={12} />
                              {t('admin.download')}
                            </button>
                            <button
                              onClick={() => setDeleteTarget(file)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-900/40 text-red-500/70 hover:text-red-400 hover:border-red-500/60 transition-colors"
                              title={t('admin.delete')}
                            >
                              <Trash2 size={12} />
                              {t('admin.delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="md:hidden divide-y divide-white/5">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <FileRowIcon mimeType={file.mimeType} />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-white/80 font-medium text-sm truncate"
                          title={file.originalName}
                        >
                          {file.originalName}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">
                          {formatFileSize(file.size)} •{' '}
                          {getFileTypeLabel(file.mimeType)} •{' '}
                          {formatDate(file.uploadedAt, locale)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(file)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-white/20 text-white/60 hover:text-white transition-colors"
                      >
                        <Download size={12} />
                        {t('admin.download')}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(file)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-red-900/40 text-red-500/70 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                        {t('admin.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* ─── Delete Confirmation Modal ────────────────────────────────────── */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title={t('admin.delete')}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-950/30 border border-red-900/40 shrink-0">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm text-white/80 leading-relaxed">
                {t('admin.confirmDelete')}
              </p>
              {deleteTarget && (
                <p className="text-xs font-mono text-white/40 mt-2 break-all">
                  {deleteTarget.originalName}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              fullWidth
              loading={deleting}
              onClick={handleConfirmDelete}
            >
              <Trash2 size={14} />
              {t('admin.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
