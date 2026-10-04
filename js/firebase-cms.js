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

const SUPER_ADMIN_USERNAME = "islam";

async function initDefaults() {
  try {
    const analyticsRef = doc(db, "analytics", "main");
    const snap = await getDoc(analyticsRef);
    if (!snap.exists()) {
      await setDoc(analyticsRef, { visits: 0, leads: 0, pdfDownloads: 0, bootcampOpen: true });
    }
    
    const usersSnap = await getDocs(collection(db, "users"));
    if (usersSnap.empty) {
      await addDoc(collection(db, "users"), {
        username: SUPER_ADMIN_USERNAME,
        password: "Nour123@@##",
        role: "super_admin",
        permissions: ["analytics", "portfolio", "blog", "users", "comments"],
        createdAt: Date.now()
      });
    }
  } catch (e) {
    console.error("Init Error:", e);
  }
}
initDefaults();

export const CloudCMS = {
  // Authentication with Fine-grained Permissions
  async loginUser(username, password) {
    const q = query(collection(db, "users"), where("username", "==", username), where("password", "==", password));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const userDoc = snap.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
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
    const snap = await getDoc(doc(db, "users", id));
    if (snap.exists() && snap.data().role === "super_admin") {
      throw new Error("لا يمكن حذف الأدمن الرئيسي للنظام.");
    }
    return await deleteDoc(doc(db, "users", id));
  },

  // Portfolio with View Tracking & Likes
  subscribePortfolio(callback) {
    return onSnapshot(collection(db, "portfolio"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    });
  },

  async addPortfolioItem(data) {
    return await addDoc(collection(db, "portfolio"), { ...data, views: 0, likes: 0, createdAt: Date.now() });
  },

  async deletePortfolioItem(id) {
    return await deleteDoc(doc(db, "portfolio", id));
  },

  async getPortfolioItemById(id) {
    const itemRef = doc(db, "portfolio", id);
    const snap = await getDoc(itemRef);
    if (snap.exists()) {
      await updateDoc(itemRef, { views: increment(1) });
      return { id: snap.id, ...snap.data() };
    }
    return null;
  },

  async likePortfolioItem(id) {
    const itemRef = doc(db, "portfolio", id);
    await updateDoc(itemRef, { likes: increment(1) });
  },

  // Blog with Views, Likes & Dynamic Comments
  subscribeBlog(callback) {
    return onSnapshot(collection(db, "blog"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    });
  },

  async addBlogPost(data) {
    return await addDoc(collection(db, "blog"), { ...data, views: 0, likes: 0, createdAt: Date.now() });
  },

  async deleteBlogPost(id) {
    return await deleteDoc(doc(db, "blog", id));
  },

  async getBlogPostById(id) {
    const itemRef = doc(db, "blog", id);
    const snap = await getDoc(itemRef);
    if (snap.exists()) {
      await updateDoc(itemRef, { views: increment(1) });
      return { id: snap.id, ...snap.data() };
    }
    return null;
  },

  async likeBlogPost(id) {
    const itemRef = doc(db, "blog", id);
    await updateDoc(itemRef, { likes: increment(1) });
  },

  // Comments Moderation System
  subscribeComments(postId, callback) {
    const q = query(collection(db, "comments"), where("postId", "==", postId), where("approved", "==", true));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt - a.createdAt);
      callback(items);
    });
  },

  subscribeAllComments(callback) {
    return onSnapshot(collection(db, "comments"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt - a.createdAt);
      callback(items);
    });
  },

  async addComment(postId, name, content) {
    return await addDoc(collection(db, "comments"), {
      postId,
      name,
      content,
      approved: false, // Requires admin moderation
      createdAt: Date.now()
    });
  },

  async approveComment(id) {
    await updateDoc(doc(db, "comments", id), { approved: true });
  },

  async deleteComment(id) {
    await deleteDoc(doc(db, "comments", id));
  },

  // System Controls & Analytics
  async toggleBootcampStatus(status) {
    const analyticsRef = doc(db, "analytics", "main");
    await updateDoc(analyticsRef, { bootcampOpen: status });
  },

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
