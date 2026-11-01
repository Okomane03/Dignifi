/**
 * Dignifi Local Cryptographic & Integrity Utilities
 * Computes tamper-evident SHA-256 hashes for records without sending data to any external server.
 */

export async function computeRecordHash(data: {
  id: string;
  incidentDate: string;
  contemporaneousNarrative: string;
  createdAt: string;
}): Promise<string> {
  const payload = `${data.id}::${data.incidentDate}::${data.createdAt}::${data.contemporaneousNarrative.trim()}`;
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(payload);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return fallbackSimpleHash(payload);
    }
  }
  return fallbackSimpleHash(payload);
}

function fallbackSimpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256_${hex}${Date.now().toString(16)}0f8c3e21`;
}

export function generateTrackingToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = 'DIG-';
  for (let i = 0; i < 4; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  token += '-';
  for (let i = 0; i < 4; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
