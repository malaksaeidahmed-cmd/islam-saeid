import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc,
  updateDoc, deleteDoc, query, where, onSnapshot, limit
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from '../../firebase-config.js';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export const AcademyCMS = {
  // ==================== Modules ====================
  async getAllModules() {
    const snap = await getDocs(collection(db, 'modules'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  // ==================== Lessons ====================
  async getLesson(lessonId) {
    if (!lessonId) return null;
    const snap = await getDoc(doc(db, 'lessons', lessonId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getLessonsForCourse(courseId) {
    if (!courseId) return [];
    const q = query(collection(db, 'lessons'), where('courseId', '==', courseId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  // ==================== User Requests ====================
  async createUserRequest(uid, data) {
    return await addDoc(collection(db, 'user_requests'), {
      uid,
      ...data,
      status: 'pending',
      createdAt: Date.now()
    });
  },

  subscribeUserRequests(callback) {
    return onSnapshot(collection(db, 'user_requests'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(items);
    });
  },

  async approveUserRequest(requestId, adminUid) {
    const reqRef = doc(db, 'user_requests', requestId);
    const reqSnap = await getDoc(reqRef);
    if (!reqSnap.exists()) throw new Error('Request not found');
    const data = reqSnap.data();

    // 1. تحديث الطلب
    await updateDoc(reqRef, {
      status: 'approved',
      reviewedBy: adminUid,
      reviewedAt: Date.now()
    });

    // 2. تحديث حالة المستخدم
    await updateDoc(doc(db, 'users', data.uid), { status: 'approved' });
  },

  async rejectUserRequest(requestId, adminUid, reason) {
    const reqRef = doc(db, 'user_requests', requestId);
    await updateDoc(reqRef, {
      status: 'rejected',
      reviewedBy: adminUid,
      reviewedAt: Date.now(),
      rejectionReason: reason
    });
  },

  // ==================== Invite Codes ====================
  async verifyInviteCode(code) {
    const snap = await getDoc(doc(db, 'invite_codes', code));
    if (!snap.exists()) return { valid: false, reason: 'not_found' };
    const data = snap.data();
    if (data.usedCount >= data.maxUses) return { valid: false, reason: 'exhausted' };
    if (data.expiresAt && Date.now() > data.expiresAt) return { valid: false, reason: 'expired' };
    return { valid: true, data };
  },

  // ... (باقي الميثودز زي ما هي: Progress, Quizzes, Campaigns, إلخ)
};
