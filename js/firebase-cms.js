import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc,
  increment, getDoc, setDoc, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from '../firebase-config.js';

// ✅ نستخدم نفس الـ config من firebase-config.js
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const SUPER_ADMIN_UID = "aaxgWgX4WpZaj6IayzFMZiyvq9h2";

async function initDefaults() {
  try {
    const analyticsRef = doc(db, "analytics", "main");
    const snap = await getDoc(analyticsRef);
    if (!snap.exists()) {
      await setDoc(analyticsRef, {
        visits: 0, leads: 0, pdfDownloads: 0,
        bootcampOpen: true, maintenanceMode: false
      });
    } else {
      const data = snap.data();
      if (data.maintenanceMode === undefined) {
        await updateDoc(analyticsRef, { maintenanceMode: false });
      }
      if (data.bootcampOpen === undefined) {
        await updateDoc(analyticsRef, { bootcampOpen: true });
      }
    }
  } catch (e) {
    console.error("Init Error:", e);
  }
}

initDefaults();

export const CloudCMS = {

  subscribeUsers(callback) {
    return onSnapshot(collection(db, "admins"), (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(items);
    });
  },

  subscribePortfolio(callback) {
    return onSnapshot(collection(db, "portfolio"), (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(items);
    });
  },

  async addPortfolioItem(data) {
    return await addDoc(collection(db, "portfolio"), {
      ...data,
      mediaGallery: Array.isArray(data.mediaGallery) ? data.mediaGallery : [],
      views: 0, likes: 0, createdAt: Date.now()
    });
  },

  async updatePortfolioItem(id, data) {
    return await updateDoc(doc(db, "portfolio", id), { ...data, updatedAt: Date.now() });
  },

  async deletePortfolioItem(id) {
    return await deleteDoc(doc(db, "portfolio", id));
  },

  async getPortfolioItemById(id) {
    const itemRef = doc(db, "portfolio", id);
    const snap = await getDoc(itemRef);
    if (snap.exists()) {
      try { await updateDoc(itemRef, { views: increment(1) }); } catch (_) {}
      return { id: snap.id, ...snap.data() };
    }
    return null;
  },

  async likePortfolioItem(id) {
    await updateDoc(doc(db, "portfolio", id), { likes: increment(1) });
  },

  subscribeBlog(callback) {
    return onSnapshot(collection(db, "blog"), (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(items);
    });
  },

  async addBlogPost(data) {
    return await addDoc(collection(db, "blog"), {
      ...data,
      views: 0, likes: 0, createdAt: Date.now()
    });
  },

  async updateBlogPost(id, data) {
    return await updateDoc(doc(db, "blog", id), { ...data, updatedAt: Date.now() });
  },

  async deleteBlogPost(id) {
    return await deleteDoc(doc(db, "blog", id));
  },

  async getBlogPostById(id) {
    const itemRef = doc(db, "blog", id);
    const snap = await getDoc(itemRef);
    if (snap.exists()) {
      try { await updateDoc(itemRef, { views: increment(1) }); } catch (_) {}
      return { id: snap.id, ...snap.data() };
    }
    return null;
  },

  async likeBlogPost(id) {
    await updateDoc(doc(db, "blog", id), { likes: increment(1) });
  },

  subscribeComments(postId, callback) {
    const q = query(collection(db, "comments"), where("postId", "==", postId), where("approved", "==", true));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => b.createdAt - a.createdAt);
      callback(items);
    });
  },

  subscribeAllComments(callback) {
    return onSnapshot(collection(db, "comments"), (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => b.createdAt - a.createdAt);
      callback(items);
    });
  },

  async addComment(postId, name, content) {
    return await addDoc(collection(db, "comments"), {
      postId, name, content, approved: false, createdAt: Date.now()
    });
  },

  async approveComment(id) {
    await updateDoc(doc(db, "comments", id), { approved: true });
  },

  async deleteComment(id) {
    return await deleteDoc(doc(db, "comments", id));
  },

  async toggleBootcampStatus(status) {
    await updateDoc(doc(db, "analytics", "main"), { bootcampOpen: status });
  },

  async toggleMaintenanceMode(status) {
    await updateDoc(doc(db, "analytics", "main"), { maintenanceMode: status });
  },

  subscribeAnalytics(callback) {
    return onSnapshot(doc(db, "analytics", "main"), (snap) => {
      callback(snap.data() || {
        visits: 0, leads: 0, pdfDownloads: 0,
        bootcampOpen: true, maintenanceMode: false
      });
    });
  },

  subscribeEventLogs(callback, maxItems = 50) {
    return onSnapshot(collection(db, "event_logs"), (snapshot) => {
      const logs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, maxItems);
      callback(logs);
    });
  },

  async trackVisit() {
    try { await updateDoc(doc(db, "analytics", "main"), { visits: increment(1) }); } catch (_) {}
  },

  async logEvent(type, details) {
    try {
      const analyticsRef = doc(db, "analytics", "main");
      if (type === "PDF Download") await updateDoc(analyticsRef, { pdfDownloads: increment(1) });
      if (type === "Bootcamp Lead") await updateDoc(analyticsRef, { leads: increment(1) });

      await addDoc(collection(db, "event_logs"), {
        type, details,
        timestamp: Date.now(),
        dateString: new Date().toLocaleString("ar-EG")
      });
    } catch (e) {
      console.warn("logEvent failed:", e);
    }
  }
};
