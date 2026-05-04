import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { QRPage } from './pages/QRPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Initialize i18n
import './i18n';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-black">{children}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          {/* ─── Toast notifications ────────────────────────────────────── */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0a0a0a',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0px',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
              },
              success: {
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#000000',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#000000',
                },
              },
            }}
          />

          <Routes>
            {/* ─── Public routes ─────────────────────────────────────── */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
            <Route
              path="/upload"
              element={
                <PublicLayout>
                  <UploadPage />
                </PublicLayout>
              }
            />
            <Route
              path="/qr"
              element={
                <PublicLayout>
                  <QRPage />
                </PublicLayout>
              }
            />

            {/* ─── Admin routes ──────────────────────────────────────── */}
            <Route
              path="/admin/login"
              element={
                <AdminLayout>
                  <AdminLoginPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* ─── Catch-all ─────────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
