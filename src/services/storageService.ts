/**
 * Storage Service
 * 
 * Currently implements localStorage-based storage for the demo.
 * Architecture is designed to be easily swapped with Firebase Storage,
 * AWS S3, or any other cloud storage provider.
 * 
 * To migrate to Firebase:
 *   1. Import Firebase Storage SDK
 *   2. Replace uploadFile() with ref(storage, path) + uploadBytesResumable()
 *   3. Replace getFiles() with getDocs(collection(db, 'files'))
 *   4. Replace deleteFile() with deleteObject(ref(storage, path))
 * 
 * To migrate to AWS S3:
 *   1. Import AWS SDK v3
 *   2. Replace uploadFile() with PutObjectCommand
 *   3. Replace deleteFile() with DeleteObjectCommand
 */

import type { UploadedFile, FileStats } from '../types';
import { generateSessionId } from '../utils/fileUtils';

const STORAGE_KEY = 'bsf_uploaded_files';
const BASE_UPLOAD_URL = '/api/uploads';

// ─── Read all files from storage ────────────────────────────────────────────
function readFilesFromStorage(): UploadedFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ─── Write files to storage ──────────────────────────────────────────────────
function writeFilesToStorage(files: UploadedFile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

// ─── Upload a file ───────────────────────────────────────────────────────────
export async function uploadFile(
  file: File,
  onProgress: (progress: number) => void
): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const fileId = generateSessionId();
    const storedName = `${fileId}_${Date.now()}`;

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 95) {
        progress = 95;
        clearInterval(interval);
      }
      onProgress(Math.min(Math.round(progress), 95));
    }, 200);

    reader.onload = () => {
      clearInterval(interval);
      onProgress(100);

      const uploadedFile: UploadedFile = {
        id: fileId,
        originalName: file.name,
        storedName,
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        downloadUrl: reader.result as string, // base64 data URL for local storage
      };

      const files = readFilesFromStorage();
      files.unshift(uploadedFile);
      writeFilesToStorage(files);

      setTimeout(() => resolve(uploadedFile), 300);
    };

    reader.onerror = () => {
      clearInterval(interval);
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

// ─── Get all files ───────────────────────────────────────────────────────────
export async function getAllFiles(): Promise<UploadedFile[]> {
  // Simulated async delay (mirrors real API call)
  await new Promise((resolve) => setTimeout(resolve, 400));
  return readFilesFromStorage();
}

// ─── Delete a file by ID ─────────────────────────────────────────────────────
export async function deleteFileById(fileId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const files = readFilesFromStorage();
  const filtered = files.filter((f) => f.id !== fileId);
  writeFilesToStorage(filtered);
}

// ─── Download a file ─────────────────────────────────────────────────────────
export function downloadFile(file: UploadedFile): void {
  const link = document.createElement('a');
  link.href = file.downloadUrl;
  link.download = file.originalName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Get file statistics ─────────────────────────────────────────────────────
export async function getFileStats(): Promise<FileStats> {
  const files = readFilesFromStorage();
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const lastUpload = files.length > 0 ? files[0].uploadedAt : null;

  return {
    totalFiles: files.length,
    totalSize,
    lastUpload,
  };
}

export { BASE_UPLOAD_URL };
