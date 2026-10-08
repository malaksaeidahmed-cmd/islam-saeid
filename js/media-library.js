// ============================================================
// Media Library — مكتبة وسائط مركزية
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
  getDoc, query, where, updateDoc, increment, setDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from '../firebase-config.js';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const IMGBB_API_KEY = 'c393b2efe08ba757e8483951adbfb11c';
const MEDIA_COLLECTION = 'media_library';

export async function uploadToMediaLibrary(file, meta = {}) {
  if (!file) throw new Error('No file provided');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image too large (max 5MB)');

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || 'ImgBB error');

  const url = data.data.url;
  const thumb = data.data.thumb?.url || data.data.display_url || url;

  const docRef = await addDoc(collection(db, MEDIA_COLLECTION), {
    url,
    thumbUrl: thumb,
    deleteUrl: data.data.delete_url || '',
    name: meta.name || file.name || 'untitled',
    size: file.size,
    mime: file.type || 'image/jpeg',
    folder: meta.folder || 'uncategorized',
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    uploadedAt: Date.now(),
    uploadedBy: meta.uploadedBy || 'unknown',
    uploadedByEmail: meta.uploadedByEmail || '',
    usedIn: []
  });

  try {
    const usageRef = doc(db, 'system', 'media_usage');
    const snap = await getDoc(usageRef);
    if (snap.exists()) {
      await updateDoc(usageRef, { total: increment(1), lastUpload: Date.now() });
    } else {
      await setDoc(usageRef, { total: 1, lastUpload: Date.now() });
    }
  } catch (_) {}

  return { id: docRef.id, url, thumbUrl: thumb };
}

export function subscribeMediaLibrary(callback) {
  return onSnapshot(collection(db, MEDIA_COLLECTION), (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0));
    callback(items);
  });
}

export async function deleteMediaItem(id) {
  if (!id) throw new Error('ID required');
  const snap = await getDoc(doc(db, MEDIA_COLLECTION, id));
  if (!snap.exists()) throw new Error('Media not found');

  const data = snap.data();
  if (Array.isArray(data.usedIn) && data.usedIn.length > 0) {
    throw new Error(`لا يمكن حذف هذه الصورة لأنها مستخدمة في ${data.usedIn.length} مكان`);
  }

  await deleteDoc(doc(db, MEDIA_COLLECTION, id));

  try {
    const usageRef = doc(db, 'system', 'media_usage');
    const usageSnap = await getDoc(usageRef);
    if (usageSnap.exists()) {
      await updateDoc(usageRef, { total: increment(-1) });
    }
  } catch (_) {}
}

export async function updateMediaMeta(id, updates) {
  if (!id) throw new Error('ID required');
  const allowed = {};
  if (updates.name !== undefined) allowed.name = String(updates.name).trim();
  if (updates.folder !== undefined) allowed.folder = String(updates.folder).trim();
  if (Array.isArray(updates.tags)) allowed.tags = updates.tags;
  allowed.updatedAt = Date.now();
  await updateDoc(doc(db, MEDIA_COLLECTION, id), allowed);
}

export async function trackMediaUsage(url, usage) {
  if (!url) return;
  try {
    const q = query(collection(db, MEDIA_COLLECTION), where('url', '==', url));
    const snap = await getDocs(q);
    if (snap.empty) return;
    const mediaDoc = snap.docs[0];
    const existing = mediaDoc.data().usedIn || [];
    const exists = existing.some(u => u.type === usage.type && u.id === usage.id);
    if (exists) return;
    await updateDoc(doc(db, MEDIA_COLLECTION, mediaDoc.id), {
      usedIn: [...existing, usage]
    });
  } catch (err) {
    console.warn('trackMediaUsage error:', err);
  }
}

export function subscribeStorageStats(callback) {
  return onSnapshot(doc(db, 'system', 'media_usage'), (snap) => {
    callback(snap.exists() ? snap.data() : { total: 0, lastUpload: 0 });
  });
}

export const MEDIA_FOLDERS = [
  { id: 'uncategorized', name: 'بدون تصنيف', icon: 'fa-folder' },
  { id: 'covers', name: 'أغلفة المقالات', icon: 'fa-image' },
  { id: 'portfolio', name: 'سابقة الأعمال', icon: 'fa-briefcase' },
  { id: 'team', name: 'فريق العمل', icon: 'fa-users' },
  { id: 'logos', name: 'شعارات', icon: 'fa-star' },
  { id: 'banners', name: 'بانرات', icon: 'fa-flag' }
];
