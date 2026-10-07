// ============================================================
// Authentication Module — Firebase Auth + Firestore Roles
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc, collection, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig, SESSION_CONFIG, SUPER_ADMIN_UID } from '../firebase-config.js';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const PROFILE_CACHE_KEY = 'cms_cached_profile';

// ============================================================
// Profile Cache
// ============================================================
function cacheProfile(uid, profile) {
  try {
    sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({
      uid, profile, cachedAt: Date.now()
    }));
  } catch (_) {}
}

function getCachedProfile(uid) {
  try {
    const raw = sessionStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.uid !== uid) return null;
    if (Date.now() - data.cachedAt > 30 * 60 * 1000) return null;
    return data.profile;
  } catch (_) {
    return null;
  }
}

function clearProfileCache() {
  try { sessionStorage.removeItem(PROFILE_CACHE_KEY); } catch (_) {}
}

// ============================================================
// Firestore Read with Timeout
// ============================================================
async function getAdminProfileWithTimeout(uid, timeoutMs = 5000) {
  try {
    return await Promise.race([
      getAdminProfile(uid),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('firestore-timeout')), timeoutMs)
      )
    ]);
  } catch (err) {
    console.warn('[Auth] Profile fetch failed:', err.message);
    return null;
  }
}

// ============================================================
// Sign In
// ============================================================
export async function signIn(email, password, rememberMe = false) {
  try {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);

    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = credential.user;

    let adminProfile = await getAdminProfileWithTimeout(user.uid, 5000);

    // Fallback for super admin if Firestore is slow
    if (!adminProfile && user.uid === SUPER_ADMIN_UID) {
      console.warn('[Auth] Firestore unavailable — using super admin fallback');
      adminProfile = {
        id: user.uid,
        email: user.email,
        displayName: 'إسلام سعيد',
        role: 'super_admin',
        active: true,
        permissions: ['analytics', 'portfolio', 'blog', 'comments', 'users', 'settings'],
        _pendingSync: true
      };
    }

    if (!adminProfile) {
      await fbSignOut(auth);
      throw new Error('تعذر تحميل بيانات الحساب. تواصل مع الأدمن الرئيسي.');
    }

    if (adminProfile.active === false) {
      await fbSignOut(auth);
      throw new Error('هذا الحساب معطّل حالياً.');
    }

    cacheProfile(user.uid, adminProfile);

    sessionStorage.setItem(SESSION_CONFIG.storageKey, JSON.stringify({
      uid: user.uid,
      email: user.email,
      loginAt: Date.now(),
      expiresAt: Date.now() + SESSION_CONFIG.ttlMs
    }));

    if (rememberMe) localStorage.setItem(SESSION_CONFIG.rememberMeKey, 'true');
    else localStorage.removeItem(SESSION_CONFIG.rememberMeKey);

    return { user, profile: adminProfile };
  } catch (error) {
    console.error('Sign in error:', error);
    if (error?.message && !error?.code) throw error;
    throw new Error(translateAuthError(error));
  }
}

// ============================================================
// Sign Out
// ============================================================
export async function signOut() {
  try {
    await fbSignOut(auth);
  } catch (e) {
    console.warn('Sign out error:', e);
  }
  sessionStorage.removeItem(SESSION_CONFIG.storageKey);
  localStorage.removeItem(SESSION_CONFIG.rememberMeKey);
  clearProfileCache();
}

// ============================================================
// Auth State Listener
// ============================================================
export function onAuthChange(callback) {
  try {
    const metaRaw = sessionStorage.getItem(SESSION_CONFIG.storageKey);
    const cachedRaw = sessionStorage.getItem(PROFILE_CACHE_KEY);
    if (metaRaw && cachedRaw) {
      const meta = JSON.parse(metaRaw);
      const cached = JSON.parse(cachedRaw);
      if (meta.expiresAt && Date.now() < meta.expiresAt &&
          cached.profile && cached.profile.active !== false) {
        console.log('[Auth] onAuthChange → cache hit');
        callback({ uid: cached.uid, email: meta.email }, cached.profile);
      }
    }
  } catch (_) {}

  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log('[Auth] onAuthChange → no Firebase user');
      callback(null, null);
      return;
    }

    const cached = getCachedProfile(user.uid);
    if (cached) {
      console.log('[Auth] onAuthChange → cached profile');
      callback(user, cached);
      refreshProfileInBackground(user.uid);
      return;
    }

    const profile = await getAdminProfileWithTimeout(user.uid, 5000);
    if (!profile || profile.active === false) {
      if (!profile && user.uid === SUPER_ADMIN_UID) {
        const fallback = {
          id: user.uid, email: user.email, displayName: 'إسلام سعيد',
          role: 'super_admin', active: true,
          permissions: ['analytics', 'portfolio', 'blog', 'comments', 'users', 'settings'],
          _pendingSync: true
        };
        cacheProfile(user.uid, fallback);
        callback(user, fallback);
        return;
      }
      callback(null, null);
      return;
    }

    cacheProfile(user.uid, profile);
    callback(user, profile);
  });
}

async function refreshProfileInBackground(uid) {
  try {
    const fresh = await getAdminProfileWithTimeout(uid, 4000);
    if (fresh && fresh.active !== false) cacheProfile(uid, fresh);
  } catch (_) {}
}

// ============================================================
// Password Reset
// ============================================================
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return true;
  } catch (error) {
    throw new Error(translateAuthError(error));
  }
}

// ============================================================
// Get Admin Profile
// ============================================================
export async function getAdminProfile(uid) {
  try {
    const snap = await getDoc(doc(db, 'admins', uid));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error('Get admin profile error:', error);
    return null;
  }
}

// ============================================================
// Create New Admin (super_admin only)
// ============================================================
export async function createAdmin(email, password, adminData) {
  // Save current admin session before Firebase signs us out
  const currentMeta = sessionStorage.getItem(SESSION_CONFIG.storageKey);
  const currentCache = sessionStorage.getItem(PROFILE_CACHE_KEY);

  try {
    // 1. Create Firebase Auth user (this signs out current admin)
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const newUid = credential.user.uid;

    // 2. Create admin doc in Firestore with the new UID
    await setDoc(doc(db, 'admins', newUid), {
      email: email.trim(),
      displayName: adminData.displayName || email.split('@')[0],
      role: adminData.role || 'sub_admin',
      permissions: Array.isArray(adminData.permissions) ? adminData.permissions : [],
      active: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    return { uid: newUid, email: email.trim() };
  } finally {
    // 3. Sign out the newly created user, restore original admin session
    try {
      await fbSignOut(auth);
      if (currentMeta && currentCache) {
        sessionStorage.setItem(SESSION_CONFIG.storageKey, currentMeta);
        sessionStorage.setItem(PROFILE_CACHE_KEY, currentCache);
      }
    } catch (e) {
      console.warn('Restore session error:', e);
    }
  }
}

// ============================================================
// Update Admin
// ============================================================
export async function updateAdmin(uid, updates) {
  const adminRef = doc(db, 'admins', uid);
  const payload = { ...updates, updatedAt: Date.now() };
  delete payload.password;
  await setDoc(adminRef, payload, { merge: true });
}

// ============================================================
// Delete Admin
// ============================================================
export async function deleteAdmin(uid) {
  const snap = await getDoc(doc(db, 'admins', uid));
  if (snap.exists() && snap.data().role === 'super_admin') {
    throw new Error('لا يمكن حذف الأدمن الرئيسي');
  }
  await deleteDoc(doc(db, 'admins', uid));
}

// ============================================================
// Subscribe Admins (real-time)
// ============================================================
export function subscribeAdmins(callback) {
  return onSnapshot(collection(db, 'admins'), (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// ============================================================
// Permissions
// ============================================================
export function hasPermission(profile, permission) {
  if (!profile) return false;
  if (profile.role === 'super_admin') return true;
  const perms = Array.isArray(profile.permissions) ? profile.permissions : [];
  return perms.includes(permission);
}

export function isSuperAdmin(profile) {
  return profile?.role === 'super_admin';
}

// ============================================================
// Session Helpers
// ============================================================
export function getSessionMeta() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_CONFIG.storageKey) || 'null');
  } catch (_) {
    return null;
  }
}

export function isSessionExpired() {
  const meta = getSessionMeta();
  if (!meta || !meta.expiresAt) return true;
  return Date.now() > meta.expiresAt;
}

export function getCurrentUserSync() {
  return auth.currentUser;
}

export function getAuthInstance() {
  return auth;
}

// ============================================================
// Error Translation
// ============================================================
function translateAuthError(error) {
  const code = error?.code || '';
  const messages = {
    'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
    'auth/user-disabled': 'هذا الحساب معطّل',
    'auth/user-not-found': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    'auth/wrong-password': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    'auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    'auth/too-many-requests': 'تم تجاوز عدد المحاولات. حاول مرة أخرى بعد قليل.',
    'auth/network-request-failed': 'فشل الاتصال. تحقق من الإنترنت.',
    'auth/email-already-in-use': 'هذا البريد الإلكتروني مستخدم بالفعل',
    'auth/weak-password': 'كلمة المرور ضعيفة جداً',
    'auth/requires-recent-login': 'يجب تسجيل الدخول مرة أخرى',
    'auth/operation-not-allowed': 'هذه العملية غير مفعلة. تواصل مع الدعم.'
  };
  return messages[code] || error?.message || 'حدث خطأ في المصادقة';
}
