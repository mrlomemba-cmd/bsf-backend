// ─── File Entity ────────────────────────────────────────────────────────────
export interface UploadedFile {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  downloadUrl: string;
}

// ─── Upload State ────────────────────────────────────────────────────────────
export interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  file: File | null;
  error: string | null;
  uploadedFile: UploadedFile | null;
}

// ─── Admin Auth ──────────────────────────────────────────────────────────────
export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ─── API Response ────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ─── File Stats ──────────────────────────────────────────────────────────────
export interface FileStats {
  totalFiles: number;
  totalSize: number;
  lastUpload: string | null;
}
