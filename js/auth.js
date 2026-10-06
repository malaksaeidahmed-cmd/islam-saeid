// ============================================================
// Authentication Module — Firebase Auth + Firestore Roles
// ============================================================
// نظام تسجيل الدخول الكامل مع الصلاحيات والجلسات

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig, SESSION_CONFIG } from '../firebase-config.js';

// ---------- Init (Singleton) ----------
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================================
// Sign In
// ============================================================
export async function signIn(email, password, rememberMe = false) {
  try {
    // Persistence: Local = يبقى بعد إغلاق المتصفح / Session = يختفي
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);

    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = credential.user;

    // Get admin profile from Firestore
    const adminProfile = await getAdminProfile(user.uid);

    if (!adminProfile) {
      await fbSignOut(auth);
      throw new Error('هذا الحساب غير مصرح له بالدخول إلى لوحة التحكم');
    }

    if (adminProfile.active === false) {
      await fbSignOut(auth);
      throw new Error('هذا الحساب معطّل حالياً. تواصل مع الأدمن الرئيسي.');
    }

    // Save session metadata
    sessionStorage.setItem(SESSION_CONFIG.storageKey, JSON.stringify({
      uid: user.uid,
      email: user.email,
      loginAt: Date.now(),
      expiresAt: Date.now() + SESSION_CONFIG.ttlMs
    }));

    if (rememberMe) {
      localStorage.setItem(SESSION_CONFIG.rememberMeKey, 'true');
    } else {
      localStorage.removeItem(SESSION_CONFIG.rememberMeKey);
    }

    return { user, profile: adminProfile };
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error(translateAuthError(error));
  }
}

// ============================================================
// Sign Out
// ============================================================
export async function signOut() {
  try {
    await fbSignOut(auth);
    sessionStorage.removeItem(SESSION_CONFIG.storageKey);
    localStorage.removeItem(SESSION_CONFIG.rememberMeKey);
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// ============================================================
// Auth State Listener
// ============================================================
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null, null);
      return;
    }

    // Check session TTL
    const meta = getSessionMeta();
    if (meta && meta.expiresAt && Date.now() > meta.expiresAt) {
      await signOut();
      callback(null, null);
      return;
    }

    const profile = await getAdminProfile(user.uid);
    if (!profile || profile.active === false) {
      await signOut();
      callback(null, null);
      return;
    }

    callback(user, profile);
  });
}

// ============================================================
// Password Reset
// ============================================================
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return true;
  } catch (error) {
    console.error('Reset password error:', error);
    throw new Error(translateAuthError(error));
  }
}

// ============================================================
// Get Admin Profile
// ============================================================
export async function getAdminProfile(uid) {
  try {
    const adminRef = doc(db, 'admins', uid);
    const snap = await getDoc(adminRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error('Get admin profile error:', error);
    return null;
  }
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
// Guards — لحماية الصفحات
// ============================================================
export async function requireAuth(redirectTo = '../login.html') {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) {
        window.location.href = redirectTo;
        reject(new Error('Not authenticated'));
        return;
      }
      const profile = await getAdminProfile(user.uid);
      if (!profile || profile.active === false) {
        await signOut();
        window.location.href = redirectTo;
        reject(new Error('Not authorized'));
        return;
      }
      resolve({ user, profile });
    });
  });
}

export async function requirePermission(permission, redirectTo = '../login.html') {
  const { user, profile } = await requireAuth(redirectTo);
  if (!hasPermission(profile, permission)) {
    throw new Error('Insufficient permissions');
  }
  return { user, profile };
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
