// ============================================================
// Academy CMS — Courses, Lessons, Quizzes, Strategies, Campaigns
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc,
  updateDoc, deleteDoc, query, where, onSnapshot, limit
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from '../firebase-config.js';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export const AcademyCMS = {

  // ============================================================
  // COURSES
  // ============================================================
  async getCourse(courseId) {
    if (!courseId) return null;
    const snap = await getDoc(doc(db, 'courses', courseId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getAllCourses() {
    const snap = await getDocs(collection(db, 'courses'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  subscribeCourses(callback) {
    return onSnapshot(collection(db, 'courses'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      callback(items);
    });
  },

  // ============================================================
  // LESSONS
  // ============================================================
  async getLesson(lessonId) {
    if (!lessonId) return null;
    const snap = await getDoc(doc(db, 'lessons', lessonId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getLessonsForCourse(courseId) {
    if (!courseId) return [];
    const q = query(collection(db, 'lessons'), where('courseId', '==', courseId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  subscribeLessonsForCourse(courseId, callback) {
    const q = query(collection(db, 'lessons'), where('courseId', '==', courseId));
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      callback(items);
    });
  },

  // ============================================================
  // QUIZZES
  // ============================================================
  async getQuiz(quizId) {
    if (!quizId) return null;
    const snap = await getDoc(doc(db, 'quizzes', quizId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getQuizByLesson(lessonId) {
    if (!lessonId) return null;
    const q = query(collection(db, 'quizzes'), where('lessonId', '==', lessonId));
    const snap = await getDocs(q);
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  async submitQuizAttempt(data) {
    if (!data || !data.uid || !data.quizId) throw new Error('بيانات ناقصة');
    const ref = await addDoc(collection(db, 'quiz_attempts'), {
      uid: data.uid,
      quizId: data.quizId,
      lessonId: data.lessonId || '',
      score: data.score || 0,
      passed: data.passed || false,
      answers: data.answers || [],
      duration: data.duration || 0,
      attemptedAt: Date.now()
    });
    return { id: ref.id, ...data };
  },

  async getQuizAttempts(uid, quizId) {
    const q = query(
      collection(db, 'quiz_attempts'),
      where('uid', '==', uid),
      where('quizId', '==', quizId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.attemptedAt || 0) - (a.attemptedAt || 0));
  },

  // ============================================================
  // STRATEGIES
  // ============================================================
  async saveStrategy(uid, strategyData) {
    if (!uid) throw new Error('UID required');
    const ref = await addDoc(collection(db, 'strategies'), {
      uid,
      name: strategyData.name || 'استراتيجية جديدة',
      state: strategyData.state || {},
      simulationResult: strategyData.simulationResult || null,
      score: strategyData.score || 0,
      verdict: strategyData.verdict || null,
      status: strategyData.status || 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return { id: ref.id, ...strategyData };
  },

  async getStrategy(strategyId) {
    if (!strategyId) return null;
    const snap = await getDoc(doc(db, 'strategies', strategyId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getUserStrategies(uid) {
    if (!uid) return [];
    const q = query(collection(db, 'strategies'), where('uid', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  },

  async updateStrategy(strategyId, updates) {
    if (!strategyId) throw new Error('ID required');
    await updateDoc(doc(db, 'strategies', strategyId), {
      ...updates,
      updatedAt: Date.now()
    });
  },

  async deleteStrategy(strategyId) {
    if (!strategyId) return;
    await deleteDoc(doc(db, 'strategies', strategyId));
  },

  // ============================================================
  // CAMPAIGNS
  // ============================================================
  async createCampaign(campaignData) {
    if (!campaignData || !campaignData.uid) throw new Error('UID required');
    const ref = await addDoc(collection(db, 'campaigns'), {
      uid: campaignData.uid,
      strategyId: campaignData.strategyId || '',
      platform: campaignData.platform || 'meta',
      campaignData: campaignData.campaignData || {},
      adSets: campaignData.adSets || [],
      ads: campaignData.ads || [],
      status: campaignData.status || 'draft',
      budget: campaignData.budget || 0,
      duration: campaignData.duration || 30,
      startedAt: campaignData.startedAt || null,
      completedAt: null,
      results: campaignData.results || null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return { id: ref.id, ...campaignData };
  },

  async getCampaign(campaignId) {
    if (!campaignId) return null;
    const snap = await getDoc(doc(db, 'campaigns', campaignId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getUserCampaigns(uid) {
    if (!uid) return [];
    const q = query(collection(db, 'campaigns'), where('uid', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  },

  async updateCampaign(campaignId, updates) {
    if (!campaignId) throw new Error('ID required');
    await updateDoc(doc(db, 'campaigns', campaignId), {
      ...updates,
      updatedAt: Date.now()
    });
  },

  async logDailyPerformance(dailyData) {
    if (!dailyData || !dailyData.campaignId) throw new Error('campaignId required');
    const ref = await addDoc(collection(db, 'campaign_daily'), {
      campaignId: dailyData.campaignId,
      uid: dailyData.uid,
      dayNumber: dailyData.dayNumber || 1,
      date: dailyData.date || new Date().toISOString().split('T')[0],
      impressions: dailyData.impressions || 0,
      reach: dailyData.reach || 0,
      clicks: dailyData.clicks || 0,
      ctr: dailyData.ctr || 0,
      landingViews: dailyData.landingViews || 0,
      orders: dailyData.orders || 0,
      cvr: dailyData.cvr || 0,
      spend: dailyData.spend || 0,
      revenue: dailyData.revenue || 0,
      roas: dailyData.roas || 0,
      cpa: dailyData.cpa || 0,
      audienceType: dailyData.audienceType || '',
      events: dailyData.events || [],
      userDecisions: dailyData.userDecisions || [],
      createdAt: Date.now()
    });
    return { id: ref.id };
  },

  async getCampaignDaily(campaignId) {
    if (!campaignId) return [];
    const q = query(collection(db, 'campaign_daily'), where('campaignId', '==', campaignId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0));
  },

  // ============================================================
  // CERTIFICATES
  // ============================================================
  async issueCertificate(certData) {
    if (!certData || !certData.uid) throw new Error('UID required');
    const ref = await addDoc(collection(db, 'certificates'), {
      uid: certData.uid,
      displayName: certData.displayName || '',
      certificateType: certData.certificateType || 'foundations',
      score: certData.score || 0,
      verificationCode: generateVerificationCode(),
      issuedAt: Date.now(),
      expiresAt: null
    });
    return { id: ref.id, ...certData };
  },

  async getCertificate(certId) {
    if (!certId) return null;
    const snap = await getDoc(doc(db, 'certificates', certId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getUserCertificates(uid) {
    if (!uid) return [];
    const q = query(collection(db, 'certificates'), where('uid', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.issuedAt || 0) - (a.issuedAt || 0));
  },

  async getCertificateByCode(code) {
    if (!code) return null;
    const q = query(collection(db, 'certificates'), where('verificationCode', '==', code));
    const snap = await getDocs(q);
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  // ============================================================
  // CHALLENGES
  // ============================================================
  async getChallenge(challengeId) {
    if (!challengeId) return null;
    const snap = await getDoc(doc(db, 'challenges', challengeId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  subscribeChallenges(callback) {
    return onSnapshot(collection(db, 'challenges'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.startDate || 0) - (a.startDate || 0));
      callback(items);
    });
  },

  async submitChallenge(submissionData) {
    if (!submissionData || !submissionData.uid || !submissionData.challengeId) {
      throw new Error('بيانات ناقصة');
    }
    const ref = await addDoc(collection(db, 'challenge_submissions'), {
      challengeId: submissionData.challengeId,
      uid: submissionData.uid,
      displayName: submissionData.displayName || '',
      submission: submissionData.submission || {},
      score: 0,
      rank: 0,
      submittedAt: Date.now()
    });
    return { id: ref.id };
  },

  async getChallengeSubmissions(challengeId) {
    if (!challengeId) return [];
    const q = query(collection(db, 'challenge_submissions'), where('challengeId', '==', challengeId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  },

  // ============================================================
  // LEADERBOARD
  // ============================================================
  async getLeaderboard(period = 'weekly') {
    const snap = await getDoc(doc(db, 'leaderboard', period));
    return snap.exists() ? { id: snap.id, ...snap.data() } : { rankings: [] };
  },

  subscribeLeaderboard(period, callback) {
    return onSnapshot(doc(db, 'leaderboard', period), (snap) => {
      callback(snap.exists() ? { id: snap.id, ...snap.data() } : { rankings: [] });
    });
  },

  // ============================================================
  // BADGES
  // ============================================================
  async getBadge(badgeId) {
    if (!badgeId) return null;
    const snap = await getDoc(doc(db, 'badges', badgeId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getAllBadges() {
    const snap = await getDocs(collection(db, 'badges'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  subscribeAllBadges(callback) {
    return onSnapshot(collection(db, 'badges'), (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  // ============================================================
  // EVENT LOGGING
  // ============================================================
  async logEvent(uid, type, metadata = {}) {
    try {
      await addDoc(collection(db, 'events_log'), {
        uid: uid || null,
        type,
        metadata,
        timestamp: Date.now()
      });
    } catch (err) {
      console.warn('logEvent failed:', err);
    }
  }
};

// ============================================================
// Helpers
// ============================================================
function generateVerificationCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i === 3 || i === 7) code += '-';
  }
  return code;
}
