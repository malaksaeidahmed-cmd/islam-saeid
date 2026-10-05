// ============================================================
// SHA-256 Password Hashing via Web Crypto API
// ============================================================

const HASH_PREFIX = '$sha256$';
const SALT = 'islamsaeid_secure_salt_v1_2025';

export async function hashPassword(password) {
  if (!password) return '';
  if (typeof password === 'string' && password.startsWith(HASH_PREFIX)) {
    return password;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(SALT + '::' + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return HASH_PREFIX + hashHex;
}

export async function verifyPassword(plainPassword, storedValue) {
  if (!storedValue) return { ok: false, needsUpgrade: false };

  if (!storedValue.startsWith(HASH_PREFIX)) {
    const ok = plainPassword === storedValue;
    return { ok, needsUpgrade: ok };
  }

  const hashed = await hashPassword(plainPassword);
  return { ok: hashed === storedValue, needsUpgrade: false };
}

export function isHashed(value) {
  return typeof value === 'string' && value.startsWith(HASH_PREFIX);
}
