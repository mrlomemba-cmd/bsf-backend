/**
 * Authentication Service
 *
 * JWT-based authentication simulation.
 * In production, replace the mock login with a real API call:
 *   POST /api/auth/login  →  { token: string }
 *
 * The token is stored in localStorage and validated on each protected route.
 */

const TOKEN_KEY = 'bsf_admin_token';
const TOKEN_EXPIRY_KEY = 'bsf_token_expiry';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// ─── Mock admin credentials (in production, verified server-side) ─────────────
const MOCK_ADMIN = {
  email: 'admin@bsf.com',
  password: 'BSF@Admin2024!',
};

// ─── Generate a mock JWT-like token ──────────────────────────────────────────
function generateToken(email: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: email,
      role: 'admin',
      iat: Date.now(),
      exp: Date.now() + SESSION_DURATION_MS,
    })
  );
  const signature = btoa(`${header}.${payload}.bsf_secret_key`);
  return `${header}.${payload}.${signature}`;
}

// ─── Login ───────────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<string> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (
    email.toLowerCase().trim() !== MOCK_ADMIN.email ||
    password !== MOCK_ADMIN.password
  ) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(email);
  const expiry = Date.now() + SESSION_DURATION_MS;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());

  return token;
}

// ─── Logout ──────────────────────────────────────────────────────────────────
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

// ─── Check if authenticated ───────────────────────────────────────────────────
export function isAuthenticated(): boolean {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiry) return false;

  if (Date.now() > parseInt(expiry, 10)) {
    logout(); // Clear expired session
    return false;
  }

  return true;
}

// ─── Get stored token ─────────────────────────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
