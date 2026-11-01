/**
 * Dignifi Authentication & Cryptographic Security Engine
 *
 * Implements:
 * - PBKDF2-HMAC-SHA256 (250,000 iterations) with unique 128-bit cryptographic salts
 * - 12+ character password policy with spaces/passphrases support
 * - Known compromised / common password rejection
 * - Rate limiting (locks after 5 failed attempts for 60s)
 * - Session management with 30-minute inactivity expiry
 * - Zero logging of sensitive credentials
 */

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  role: 'employee' | 'hr';
  saltHex: string;
  hashHex: string;
  iterations: number;
  recoveryKeyHash: string; // for password reset
  createdAt: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  username: string;
  email: string;
  role: 'employee' | 'hr';
  expiresAt: number; // timestamp ms
  lastActive: number;
}

const COMMON_COMPROMISED_PASSWORDS = new Set([
  'password1234',
  'password12345',
  'password123456',
  '123456789012',
  '1234567890123',
  'qwertyuiop12',
  'qwerty123456',
  'welcome123456',
  'welcome12345',
  'admin12345678',
  'administrator1',
  'letmein123456',
  'iloveyou12345',
  'monkey1234567',
  'football12345',
  'master1234567',
  'southafrica123',
  'dignifi123456',
  'johannesburg1',
]);

const USER_STORAGE_KEY = 'dignifi_auth_users_v2';
const SESSION_STORAGE_KEY = 'dignifi_auth_session_v2';
const RATE_LIMIT_STORAGE_KEY = 'dignifi_auth_rate_limit_v2';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

// Cryptographic helpers using standard WebCrypto API
async function deriveKey(password: string, salt: Uint8Array, iterations = 250000): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256 // 32 bytes
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateRandomSalt(length = 16): Uint8Array {
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return salt;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

// Password Strength Evaluation
export interface PasswordStrengthResult {
  score: 0 | 1 | 2 | 3 | 4; // 0=Very Weak, 1=Weak, 2=Fair, 3=Good, 4=Strong
  label: 'Too Short' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  feedback: string[];
  isValid: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  const normalized = password.toLowerCase().trim();

  // Criteria 1: Minimum 12 characters
  if (password.length < 12) {
    return {
      score: 0,
      label: 'Too Short',
      color: '#D9534F',
      feedback: ['Password must be at least 12 characters long.'],
      isValid: false
    };
  }

  // Criteria 2: Check compromised list
  if (COMMON_COMPROMISED_PASSWORDS.has(normalized)) {
    return {
      score: 1,
      label: 'Weak',
      color: '#D9534F',
      feedback: ['This is a commonly used or compromised password. Please choose a unique password or memorable passphrase.'],
      isValid: false
    };
  }

  let score = 1;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasSpaces = /\s/.test(password);

  // Generous reward for passphrase length
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;

  // Diversity bonus without strict composition penalties
  const categoriesPresent = [hasUpper, hasLower, hasNumber, hasSpecial || hasSpaces].filter(Boolean).length;
  if (categoriesPresent >= 3) score += 1;
  if (categoriesPresent >= 4) score += 1;

  // Cap score at 4
  const finalScore = Math.min(4, Math.max(1, score)) as 1 | 2 | 3 | 4;

  const labels: Record<number, 'Weak' | 'Fair' | 'Good' | 'Strong'> = {
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong'
  };

  const colors: Record<number, string> = {
    1: '#E67E22',
    2: '#D4AC0D',
    3: '#27AE60',
    4: '#1E8449'
  };

  if (password.length < 14 && categoriesPresent < 3) {
    feedback.push('Consider adding uppercase letters, numbers, symbols, or using a multi-word passphrase.');
  }

  return {
    score: finalScore,
    label: labels[finalScore],
    color: colors[finalScore],
    feedback,
    isValid: true
  };
}

// User persistence
export function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

// Rate Limiting
interface RateLimitInfo {
  failedAttempts: number;
  lockedUntil: number | null;
}

function getRateLimit(identifier: string): RateLimitInfo {
  try {
    const raw = localStorage.getItem(`${RATE_LIMIT_STORAGE_KEY}_${identifier.toLowerCase()}`);
    return raw ? JSON.parse(raw) : { failedAttempts: 0, lockedUntil: null };
  } catch {
    return { failedAttempts: 0, lockedUntil: null };
  }
}

function recordFailedAttempt(identifier: string): { isLocked: boolean; remainingLockSeconds: number } {
  const info = getRateLimit(identifier);
  const now = Date.now();
  info.failedAttempts += 1;

  if (info.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    info.lockedUntil = now + LOCKOUT_DURATION_MS;
  }

  localStorage.setItem(`${RATE_LIMIT_STORAGE_KEY}_${identifier.toLowerCase()}`, JSON.stringify(info));

  if (info.lockedUntil && info.lockedUntil > now) {
    return {
      isLocked: true,
      remainingLockSeconds: Math.ceil((info.lockedUntil - now) / 1000)
    };
  }

  return { isLocked: false, remainingLockSeconds: 0 };
}

function resetRateLimit(identifier: string) {
  localStorage.removeItem(`${RATE_LIMIT_STORAGE_KEY}_${identifier.toLowerCase()}`);
}

export function checkRateLimit(identifier: string): { isLocked: boolean; remainingLockSeconds: number } {
  const info = getRateLimit(identifier);
  const now = Date.now();
  if (info.lockedUntil && info.lockedUntil > now) {
    return {
      isLocked: true,
      remainingLockSeconds: Math.ceil((info.lockedUntil - now) / 1000)
    };
  }
  return { isLocked: false, remainingLockSeconds: 0 };
}

// Registration
export async function registerUser(params: {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  recoverySecretWord: string;
  role?: 'employee' | 'hr';
}): Promise<{ success: boolean; error?: string; user?: StoredUser }> {
  const { username, email, password, passwordConfirm, recoverySecretWord, role = 'employee' } = params;

  if (!username.trim() || !email.trim() || !password || !recoverySecretWord.trim()) {
    return { success: false, error: 'All fields are required.' };
  }

  if (password !== passwordConfirm) {
    return { success: false, error: 'Password confirmation does not match.' };
  }

  const strength = evaluatePasswordStrength(password);
  if (!strength.isValid) {
    return { success: false, error: strength.feedback[0] || 'Password does not meet the minimum requirements.' };
  }

  const users = getStoredUsers();
  const existing = users.find(
    u => u.username.toLowerCase() === username.trim().toLowerCase() || u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (existing) {
    return { success: false, error: 'A user with this username or email already exists.' };
  }

  const salt = generateRandomSalt(16);
  const iterations = 250000;
  const hashHex = await deriveKey(password, salt, iterations);

  // Hash recovery word for password reset
  const recoverySalt = generateRandomSalt(16);
  const recoveryHash = await deriveKey(recoverySecretWord.trim().toLowerCase(), recoverySalt, 50000);

  const newUser: StoredUser = {
    id: `usr_${Date.now()}`,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    role,
    saltHex: toHex(salt),
    hashHex,
    iterations,
    recoveryKeyHash: `${toHex(recoverySalt)}:${recoveryHash}`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveStoredUsers(users);

  return { success: true, user: newUser };
}

// Authentication / Login
export async function authenticateUser(params: {
  identifier: string; // username or email
  password: string;
  requiredRole?: 'employee' | 'hr';
}): Promise<{ success: boolean; error?: string; session?: AuthSession; isLocked?: boolean; remainingLockSeconds?: number }> {
  const { identifier, password, requiredRole } = params;
  const trimmed = identifier.trim().toLowerCase();

  // Check rate limit
  const rateStatus = checkRateLimit(trimmed);
  if (rateStatus.isLocked) {
    return {
      success: false,
      error: `Too many unsuccessful login attempts. Please wait ${rateStatus.remainingLockSeconds} seconds before trying again.`,
      isLocked: true,
      remainingLockSeconds: rateStatus.remainingLockSeconds
    };
  }

  const users = getStoredUsers();
  const user = users.find(u => u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed);

  if (!user) {
    const rate = recordFailedAttempt(trimmed);
    return {
      success: false,
      error: rate.isLocked
        ? `Account temporarily locked due to repeated failed attempts. Please wait ${rate.remainingLockSeconds}s.`
        : 'Invalid credentials. Please verify your username/email and password.',
      isLocked: rate.isLocked,
      remainingLockSeconds: rate.remainingLockSeconds
    };
  }

  const userRole = user.role || 'employee';
  if (requiredRole && userRole !== requiredRole) {
    return {
      success: false,
      error: `This account does not have access to the selected ${requiredRole === 'hr' ? 'HR Portal' : 'Employee Workspace'}. Please select the appropriate role option.`,
    };
  }

  const salt = fromHex(user.saltHex);
  const derivedHash = await deriveKey(password, salt, user.iterations);

  if (derivedHash !== user.hashHex) {
    const rate = recordFailedAttempt(trimmed);
    return {
      success: false,
      error: rate.isLocked
        ? `Account temporarily locked due to repeated failed attempts. Please wait ${rate.remainingLockSeconds}s.`
        : 'Invalid credentials. Please verify your username/email and password.',
      isLocked: rate.isLocked,
      remainingLockSeconds: rate.remainingLockSeconds
    };
  }

  // Authentication successful - reset rate limit and create session
  resetRateLimit(trimmed);

  const sessionToken = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const now = Date.now();
  const session: AuthSession = {
    token: sessionToken,
    userId: user.id,
    username: user.username,
    email: user.email,
    role: userRole,
    expiresAt: now + SESSION_TIMEOUT_MS,
    lastActive: now
  };

  saveSession(session);
  return { success: true, session };
}

// Password Reset Flow
export async function resetPassword(params: {
  identifier: string;
  recoverySecretWord: string;
  newPassword: string;
  newPasswordConfirm: string;
}): Promise<{ success: boolean; error?: string }> {
  const { identifier, recoverySecretWord, newPassword, newPasswordConfirm } = params;
  const trimmed = identifier.trim().toLowerCase();

  if (newPassword !== newPasswordConfirm) {
    return { success: false, error: 'New password confirmation does not match.' };
  }

  const strength = evaluatePasswordStrength(newPassword);
  if (!strength.isValid) {
    return { success: false, error: strength.feedback[0] || 'Password does not meet security criteria.' };
  }

  const users = getStoredUsers();
  const userIdx = users.findIndex(u => u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed);

  if (userIdx === -1) {
    return { success: false, error: 'No account found matching that username or email.' };
  }

  const user = users[userIdx];
  const [saltHex, expectedHash] = user.recoveryKeyHash.split(':');
  const salt = fromHex(saltHex);
  const candidateHash = await deriveKey(recoverySecretWord.trim().toLowerCase(), salt, 50000);

  if (candidateHash !== expectedHash) {
    return { success: false, error: 'Recovery secret word is incorrect. Reset verification failed.' };
  }

  // Set new password with fresh salt
  const newSalt = generateRandomSalt(16);
  const newHash = await deriveKey(newPassword, newSalt, 250000);

  users[userIdx] = {
    ...user,
    saltHex: toHex(newSalt),
    hashHex: newHash
  };

  saveStoredUsers(users);
  return { success: true };
}

// Session Management
export function getActiveSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    const now = Date.now();

    // Inactivity expiry check
    if (now > session.expiresAt || now - session.lastActive > SESSION_TIMEOUT_MS) {
      clearSession();
      return null;
    }

    // Refresh last active
    session.lastActive = now;
    session.expiresAt = now + SESSION_TIMEOUT_MS;
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession) {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

// Seed demo users if storage is empty so user can test immediately
export async function seedDemoUserIfEmpty() {
  const users = getStoredUsers();
  const hasEmployee = users.some(u => u.username === 'dignifi_user');
  const hasHr = users.some(u => u.username === 'dignifi_hr');

  if (!hasEmployee || !hasHr) {
    const salt1 = generateRandomSalt(16);
    const hash1 = await deriveKey('DignifiedWorkplace2026!', salt1, 250000);
    const recoverySalt1 = generateRandomSalt(16);
    const recoveryHash1 = await deriveKey('freedom', recoverySalt1, 50000);

    const salt2 = generateRandomSalt(16);
    const hash2 = await deriveKey('DignifiedWorkplace2026!', salt2, 250000);
    const recoverySalt2 = generateRandomSalt(16);
    const recoveryHash2 = await deriveKey('integrity', recoverySalt2, 50000);

    const updatedUsers = [...users];

    if (!hasEmployee) {
      updatedUsers.push({
        id: 'usr_demo_employee_01',
        username: 'dignifi_user',
        email: 'employee@dignifi.local',
        role: 'employee',
        saltHex: toHex(salt1),
        hashHex: hash1,
        iterations: 250000,
        recoveryKeyHash: `${toHex(recoverySalt1)}:${recoveryHash1}`,
        createdAt: new Date().toISOString()
      });
    }

    if (!hasHr) {
      updatedUsers.push({
        id: 'usr_demo_hr_01',
        username: 'dignifi_hr',
        email: 'hr.lead@dignifi.local',
        role: 'hr',
        saltHex: toHex(salt2),
        hashHex: hash2,
        iterations: 250000,
        recoveryKeyHash: `${toHex(recoverySalt2)}:${recoveryHash2}`,
        createdAt: new Date().toISOString()
      });
    }

    saveStoredUsers(updatedUsers);
  }
}
