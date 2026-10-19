// ============================================================
// Firebase Auth — Student Authentication
// ============================================================
// Note: This is separate from ../auth.js (admin auth)

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile as fbUpdateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from '../../firebase-config.js';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

const SESSION_CACHE_KEY = 'student_session_cache';
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ============================================================
// Register
// ============================================================
export async function registerStudent({ email, password, displayName }) {
  if (!email || !password) throw new Error('البريد وكلمة المرور مطلوبان');
  if (password.length < 8) throw new Error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  if (!displayName || displayName.trim().length < 2) throw new Error('الاسم يجب أن يكون حرفين على الأقل');

  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = credential.user;

    await fbUpdateProfile(user, { displayName: displayName.trim() });

    return { user, displayName: displayName.trim() };
  } catch (error) {
    throw new Error(translateAuthError(error));
  }
}

// ============================================================
// Login
// ============================================================
export async function loginStudent({ email, password, rememberMe = false }) {
  if (!email || !password) throw new Error('البريد وكلمة المرور مطلوبان');

  try {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);

    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return { user: credential.user };
  } catch (error) {
    throw new Error(translateAuthError(error));
  }
}

// ============================================================
// Logout
// ============================================================
export async function logoutStudent() {
  try {
    await fbSignOut(auth);
    sessionStorage.removeItem(SESSION_CACHE_KEY);
  } catch (error) {
    console.warn('Logout error:', error);
  }
}

// ============================================================
// Password Reset
// ============================================================
export async function sendResetEmail(email) {
  if (!email) throw new Error('البريد الإلكتروني مطلوب');
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return true;
  } catch (error) {
    throw new Error(translateAuthError(error));
  }
}

// ============================================================
// Auth State Listener
// ============================================================
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      cacheSession({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        cachedAt: Date.now()
      });
      callback(user);
    } else {
      sessionStorage.removeItem(SESSION_CACHE_KEY);
      callback(null);
    }
  });
}

// ============================================================
// Require Auth (redirect if not logged in)
// ============================================================
export function requireStudentAuth(redirectTo = 'auth.html') {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (!user) {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
        reject(new Error('Not authenticated'));
        return;
      }
      resolve(user);
    });
  });
}

// ============================================================
// Redirect if Logged In (for auth pages)
// ============================================================
export function redirectIfLoggedIn(target = 'academy.html') {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        window.location.href = target;
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// ============================================================
// Session Cache
// ============================================================
function cacheSession(data) {
  try {
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(data));
  } catch (_) {}
}

export function getCachedSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - (data.cachedAt || 0) > SESSION_TTL) {
      sessionStorage.removeItem(SESSION_CACHE_KEY);
      return null;
    }
    return data;
  } catch (_) {
    return null;
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}

// ============================================================
// Error Translation
// ============================================================
function translateAuthError(error) {
  const code = error?.code || '';
  const messages = {
    'auth/email-already-in-use': 'هذا البريد الإلكتروني مستخدم بالفعل',
    'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
    'auth/weak-password': 'كلمة المرور ضعيفة جداً (8 أحرف على الأقل)',
    'auth/user-not-found': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    'auth/wrong-password': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    'auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    'auth/too-many-requests': 'تم تجاوز عدد المحاولات. حاول بعد قليل',
    'auth/network-request-failed': 'فشل الاتصال. تحقق من الإنترنت',
    'auth/user-disabled': 'هذا الحساب معطّل',
    'auth/operation-not-allowed': 'التسجيل غير مفعّل. تواصل مع الدعم'
  };
  return messages[code] || error?.message || 'حدث خطأ في المصادقة';
}
