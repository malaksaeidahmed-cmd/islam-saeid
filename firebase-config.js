// ============================================================
// Firebase Configuration — Single Source of Truth
// ============================================================
// ⚠️ هذا الملف يحتوي على المفاتيح العامة لـ Firebase
// مفاتيح Firebase client-side آمنة للنشر — الحماية الحقيقية في Firestore Rules

export const firebaseConfig = {
  apiKey: "AIzaSyA3qwLMIdzgVgFHNs-qlcrezUNTqKKKWI0",
  authDomain: "my-website-e5b7e.firebaseapp.com",
  projectId: "my-website-e5b7e",
  storageBucket: "my-website-e5b7e.firebasestorage.app",
  messagingSenderId: "352964735696",
  appId: "1:352964735696:web:44e3c3930997c9826724d5"
};

// Super Admin UID (للـ debug فقط — الصلاحيات الحقيقية من Firestore)
export const SUPER_ADMIN_UID = "aaxgWgX4WpZaj6IayzFMZiyvq9h2";

// Site Metadata
export const SITE_CONFIG = {
  name: "إسلام سعيد",
  email: "islamsaeidahmed@gmail.com",
  whatsapp: "+201021252183",
  domain: "https://islamsaeid.me",
  imgbgApiKey: "c393b2efe08ba757e8483951adbfb11c"
};

// Session Settings
export const SESSION_CONFIG = {
  ttlMs: 24 * 60 * 60 * 1000, // 24 ساعة
  storageKey: 'cms_session_meta',
  rememberMeKey: 'cms_remember_me'
};
