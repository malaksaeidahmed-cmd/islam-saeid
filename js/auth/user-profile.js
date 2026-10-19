// ============================================================
// User Profile — XP, Levels, Badges, Progress
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, increment,
  onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from '../../firebase-config.js';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
// Level System
// ============================================================
export const LEVELS = [
  { level: 1, name: 'مبتدئ', nameEn: 'Beginner', minXP: 0, maxXP: 500, icon: '🌱', color: '#64748b' },
  { level: 2, name: 'متعلم', nameEn: 'Novice', minXP: 500, maxXP: 1500, icon: '📖', color: '#3b82f6' },
  { level: 3, name: 'متدرّب', nameEn: 'Apprentice', minXP: 1500, maxXP: 3000, icon: '🎯', color: '#06b6d4' },
  { level: 4, name: 'ممارس', nameEn: 'Practitioner', minXP: 3000, maxXP: 5000, icon: '⚡', color: '#8b5cf6' },
  { level: 5, name: 'متخصص', nameEn: 'Specialist', minXP: 5000, maxXP: 8000, icon: '🔧', color: '#a855f7' },
  { level: 6, name: 'خبير', nameEn: 'Expert', minXP: 8000, maxXP: 12000, icon: '🏅', color: '#d946ef' },
  { level: 7, name: 'محترف', nameEn: 'Professional', minXP: 12000, maxXP: 18000, icon: '💎', color: '#ec4899' },
  { level: 8, name: 'ماستر', nameEn: 'Master', minXP: 18000, maxXP: 26000, icon: '👑', color: '#f97316' },
  { level: 9, name: 'جراند ماستر', nameEn: 'Grandmaster', minXP: 26000, maxXP: 36000, icon: '🏆', color: '#f59e0b' },
  { level: 10, name: 'أسطورة', nameEn: 'Legend', minXP: 36000, maxXP: Infinity, icon: '🌟', color: '#fbbf24' }
];

export function getLevelFromXP(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getProgressToNextLevel(xp) {
  const current = getLevelFromXP(xp);
  if (current.level === 10) return { percent: 100, remaining: 0, nextLevel: null };
  const next = LEVELS[current.level];
  const range = next.minXP - current.minXP;
  const progress = xp - current.minXP;
  return {
    percent: Math.min(100, (progress / range) * 100),
    remaining: next.minXP - xp,
    nextLevel: next
  };
}

// ============================================================
// XP Rewards
// ============================================================
export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_PASS: 100,
  QUIZ_PERFECT: 150,
  COURSE_COMPLETE: 300,
  SIMULATION_RUN: 200,
  CAMPAIGN_LAUNCH: 500,
  CHALLENGE_COMPLETE: 1000,
  DAILY_LOGIN: 10,
  WEEKLY_STREAK: 100,
  FIRST_CAMPAIGN_BONUS: 250,
  ROAS_3X_BONUS: 300,
  ROAS_5X_BONUS: 500
};

// ============================================================
// Create Profile (after registration)
// ============================================================
export async function createUserProfile(uid, data) {
  if (!uid) throw new Error('UID required');

  const profile = {
    email: data.email || '',
    displayName: data.displayName || 'طالب جديد',
    photoURL: data.photoURL || '',
    role: 'student',
    level: 1,
    xp: 0,
    streak: 0,
    lastActiveAt: Date.now(),
    createdAt: Date.now(),
    country: data.country || 'EG',
    bio: '',
    preferences: {
      theme: 'dark',
      language: 'ar',
      notifications: true
    }
  };

  const progress = {
    coursesCompleted: [],
    lessonsCompleted: [],
    quizzesPassed: [],
    certificates: [],
    badges: [],
    simulationsRun: 0,
    campaignsLaunched: 0,
    bestROAS: 0,
    totalXPEarned: 0,
    totalTimeSpent: 0,
    createdAt: Date.now()
  };

  await setDoc(doc(db, 'users', uid), profile);
  await setDoc(doc(db, 'user_progress', uid), progress);

  return { profile, progress };
}

// ============================================================
// Get Profile
// ============================================================
export async function getUserProfile(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ============================================================
// Subscribe Profile (realtime)
// ============================================================
export function subscribeUserProfile(uid, callback) {
  if (!uid) return () => {};
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
    else callback(null);
  });
}

// ============================================================
// Get Progress
// ============================================================
export async function getUserProgress(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, 'user_progress', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export function subscribeUserProgress(uid, callback) {
  if (!uid) return () => {};
  return onSnapshot(doc(db, 'user_progress', uid), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
    else callback(null);
  });
}

// ============================================================
// Add XP
// ============================================================
export async function addXP(uid, amount, reason = '') {
  if (!uid || !amount) return null;

  const userRef = doc(db, 'users', uid);
  const progressRef = doc(db, 'user_progress', uid);

  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;

  const currentXP = userSnap.data().xp || 0;
  const newXP = currentXP + amount;
  const newLevel = getLevelFromXP(newXP);
  const oldLevel = getLevelFromXP(currentXP);

  await updateDoc(userRef, {
    xp: increment(amount),
    level: newLevel.level,
    lastActiveAt: Date.now()
  });

  await updateDoc(progressRef, {
    totalXPEarned: increment(amount)
  });

  // Log event
  try {
    const { addDoc, collection } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    await addDoc(collection(db, 'events_log'), {
      uid,
      type: 'xp_gained',
      amount,
      reason,
      timestamp: Date.now()
    });
  } catch (_) {}

  return {
    xp: newXP,
    levelChanged: newLevel.level > oldLevel.level,
    newLevel: newLevel.level > oldLevel.level ? newLevel : null,
    oldLevel
  };
}

// ============================================================
// Badge Management
// ============================================================
export async function awardBadge(uid, badgeId, badgeData) {
  if (!uid || !badgeId) return null;

  const progressRef = doc(db, 'user_progress', uid);
  const progressSnap = await getDoc(progressRef);
  if (!progressSnap.exists()) return null;

  const currentBadges = progressSnap.data().badges || [];
  if (currentBadges.includes(badgeId)) return null; // Already has badge

  await updateDoc(progressRef, {
    badges: [...currentBadges, badgeId]
  });

  return badgeData;
}

// ============================================================
// Progress Tracking
// ============================================================
export async function markLessonComplete(uid, lessonId) {
  const progressRef = doc(db, 'user_progress', uid);
  const snap = await getDoc(progressRef);
  if (!snap.exists()) return;

  const completed = snap.data().lessonsCompleted || [];
  if (!completed.includes(lessonId)) {
    await updateDoc(progressRef, {
      lessonsCompleted: [...completed, lessonId]
    });
  }
}

export async function markQuizPassed(uid, quizId, score) {
  const progressRef = doc(db, 'user_progress', uid);
  const snap = await getDoc(progressRef);
  if (!snap.exists()) return;

  const passed = snap.data().quizzesPassed || [];
  if (!passed.includes(quizId)) {
    await updateDoc(progressRef, {
      quizzesPassed: [...passed, quizId]
    });
  }
}

export async function recordSimulationRun(uid, roas) {
  const progressRef = doc(db, 'user_progress', uid);
  const snap = await getDoc(progressRef);
  if (!snap.exists()) return;

  const current = snap.data().bestROAS || 0;
  await updateDoc(progressRef, {
    simulationsRun: increment(1),
    bestROAS: Math.max(current, roas)
  });
}

export async function recordCampaignLaunch(uid) {
  await updateDoc(doc(db, 'user_progress', uid), {
    campaignsLaunched: increment(1)
  });
}

// ============================================================
// Update Profile
// ============================================================
export async function updateProfileData(uid, updates) {
  if (!uid) return;
  const allowed = {};
  ['displayName', 'bio', 'photoURL', 'country', 'preferences'].forEach(key => {
    if (updates[key] !== undefined) allowed[key] = updates[key];
  });
  if (Object.keys(allowed).length === 0) return;
  await updateDoc(doc(db, 'users', uid), allowed);
}

// ============================================================
// Streak Management
// ============================================================
export async function updateStreak(uid) {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const lastActive = data.lastActiveAt || 0;
  const now = Date.now();
  const hoursSince = (now - lastActive) / (1000 * 60 * 60);

  let newStreak = data.streak || 0;

  if (hoursSince < 24 && hoursSince > 0) {
    // Same day — no change
    return { streak: newStreak, changed: false };
  } else if (hoursSince >= 24 && hoursSince < 48) {
    // Next day — increment
    newStreak = newStreak + 1;
  } else if (hoursSince >= 48) {
    // Missed a day — reset
    newStreak = 1;
  }

  await updateDoc(userRef, {
    streak: newStreak,
    lastActiveAt: now
  });

  return { streak: newStreak, changed: true };
}
