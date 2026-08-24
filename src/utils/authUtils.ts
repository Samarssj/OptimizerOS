import { User } from '../types';

const TOKEN_KEY = 'code_optimizer_auth_token';
const USER_KEY = 'code_optimizer_auth_user';

/**
 * Safely validates and retrieves the authentication JWT token.
 * Prevents DOMExceptions and header pattern matching errors in Safari and modern browsers.
 */
export function getSafeToken(): string | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw || typeof raw !== 'string') return null;

    const trimmed = raw.trim();
    if (
      trimmed === '' ||
      trimmed === 'undefined' ||
      trimmed === 'null' ||
      trimmed === '[object Object]'
    ) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    // JWT token validation: alphanumeric, dash, underscore, period, plus, slash, equal
    if (/^[A-Za-z0-9\-_.~+/=]+$/.test(trimmed)) {
      return trimmed;
    }

    // Corrupted token in storage, remove safely
    localStorage.removeItem(TOKEN_KEY);
    return null;
  } catch (e) {
    console.warn('Unable to access localStorage token:', e);
    return null;
  }
}

/**
 * Returns safe HTTP headers for JSON requests with optional Authorization.
 */
export function getSafeAuthHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getSafeToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Stores user session securely in localStorage.
 */
export function storeAuthSession(token: string, user: User): void {
  try {
    if (token && typeof token === 'string' && /^[A-Za-z0-9\-_.~+/=]+$/.test(token.trim())) {
      localStorage.setItem(TOKEN_KEY, token.trim());
    }
    if (user && typeof user === 'object') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.warn('Failed to persist auth session to localStorage:', e);
  }
}

/**
 * Safely removes user session from localStorage.
 */
export function clearAuthSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.warn('Failed to clear auth session from localStorage:', e);
  }
}

/**
 * Safely retrieves stored user session.
 */
export function getSafeStoredUser(): User | null {
  try {
    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) return null;
    const parsed = JSON.parse(rawUser);
    if (parsed && typeof parsed === 'object' && parsed.email) {
      return parsed as User;
    }
  } catch (e) {
    localStorage.removeItem(USER_KEY);
  }
  return null;
}
