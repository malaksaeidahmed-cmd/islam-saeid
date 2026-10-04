import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, increment, getDoc, setDoc, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA3qwLMIdzgVgFHNs-qlcrezUNTqKKKWI0",
  authDomain: "my-website-e5b7e.firebaseapp.com",
  projectId: "my-website-e5b7e",
  storageBucket: "my-website-e5b7e.firebasestorage.app",
  messagingSenderId: "352964735696",
  appId: "1:352964735696:web:44e3c3930997c9826724d5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initDefaults() {
  try {
    const analyticsRef = doc(db, "analytics", "main");
    const snap = await getDoc(analyticsRef);
    if (!snap.exists()) {
      await setDoc(analyticsRef, { visits: 0, leads: 0, pdfDownloads: 0, bootcampOpen: true });
    }
    
    // Seed default admin if no users exist
    const usersSnap = await getDocs(collection(db, "users"));
    if (usersSnap.empty) {
      await addDoc(collection(db, "users"), { username: "islam", password: "Nour123@@##", role: "مدير عام", createdAt: Date.now() });
    }
  } catch (e) {
    console.error("Init Error:", e);
  }
}
initDefaults();

export const CloudCMS = {
  // Users Authentication System
  async loginUser(username, password) {
    const q = query(collection(db, "users"), where("username", "==", username), where("password", "==", password));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const user = snap.docs[0].data();
      return { id: snap.docs[0].id, ...user };
    }
    return null;
  },

  subscribeUsers(callback) {
    return onSnapshot(collection(db, "users"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    });
  },

  async addUser(userData) {
    return await addDoc(collection(db, "users"), { ...userData, createdAt: Date.now() });
  },

  async deleteUser(id) {
    return await deleteDoc(doc(db, "users", id));
  },

  // Toggle Site Mode (Bootcamp Status)
  async toggleBootcampStatus(status) {
    const analyticsRef = doc(db, "analytics", "main");
    await updateDoc(analyticsRef, { bootcampOpen: status });
  },

  // Portfolio with Media Embed
  subscribePortfolio(callback) {
    return onSnapshot(collection(db, "portfolio"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    });
  },

  async addPortfolioItem(data) {
    return await addDoc(collection(db, "portfolio"), { ...data, createdAt: Date.now() });
  },

  async deletePortfolioItem(id) {
    return await deleteDoc(doc(db, "portfolio", id));
  },

  async getPortfolioItemById(id) {
    const snap = await getDoc(doc(db, "portfolio", id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  // Blog with Media Embed
  subscribeBlog(callback) {
    return onSnapshot(collection(db, "blog"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    });
  },

  async addBlogPost(data) {
    return await addDoc(collection(db, "blog"), { ...data, createdAt: Date.now() });
  },

  async deleteBlogPost(id) {
    return await deleteDoc(doc(db, "blog", id));
  },

  async getBlogPostById(id) {
    const snap = await getDoc(doc(db, "blog", id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  // Real Analytics & Events
  subscribeAnalytics(callback) {
    return onSnapshot(doc(db, "analytics", "main"), (snap) => {
      callback(snap.data() || { visits: 0, leads: 0, pdfDownloads: 0, bootcampOpen: true });
    });
  },

  subscribeEventLogs(callback) {
    return onSnapshot(collection(db, "event_logs"), (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.timestamp - a.timestamp);
      callback(logs);
    });
  },

  async trackVisit() {
    const analyticsRef = doc(db, "analytics", "main");
    await updateDoc(analyticsRef, { visits: increment(1) });
  },

  async logEvent(type, details) {
    const analyticsRef = doc(db, "analytics", "main");
    if (type === "PDF Download") await updateDoc(analyticsRef, { pdfDownloads: increment(1) });
    if (type === "Bootcamp Lead") await updateDoc(analyticsRef, { leads: increment(1) });

    await addDoc(collection(db, "event_logs"), {
      type,
      details,
      timestamp: Date.now(),
      dateString: new Date().toLocaleString("ar-EG")
    });
  }
};
