// ============================================================
// Newsletter — نظام الاشتراك في النشرة البريدية
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, doc, getDoc, setDoc,
  query, where, getDocs, deleteDoc, updateDoc, onSnapshot, increment
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from '../firebase-config.js';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION = 'newsletter_subscribers';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export async function subscribeEmail(email, meta = {}) {
  if (!isValidEmail(email)) throw new Error('البريد الإلكتروني غير صحيح');

  const normalizedEmail = String(email).trim().toLowerCase();

  const q = query(collection(db, COLLECTION), where('email', '==', normalizedEmail));
  const snap = await getDocs(q);

  if (!snap.empty) {
    const existing = snap.docs[0];
    if (existing.data().status === 'unsubscribed') {
      await updateDoc(doc(db, COLLECTION, existing.id), {
        status: 'subscribed',
        resubscribedAt: Date.now()
      });
      return { id: existing.id, message: 'تم إعادة الاشتراك بنجاح' };
    }
    return { id: existing.id, message: 'أنت مشترك بالفعل' };
  }

  const docRef = await addDoc(collection(db, COLLECTION), {
    email: normalizedEmail,
    status: 'subscribed',
    source: meta.source || 'unknown',
    page: meta.page || window.location.pathname,
    userAgent: navigator.userAgent.slice(0, 200),
    createdAt: Date.now(),
    subscribedAt: Date.now()
  });

  try {
    const statsRef = doc(db, 'analytics', 'main');
    const statsSnap = await getDoc(statsRef);
    if (statsSnap.exists()) {
      await updateDoc(statsRef, { newsletterSubs: increment(1) });
    } else {
      await setDoc(statsRef, { newsletterSubs: 1 }, { merge: true });
    }
  } catch (_) {}

  return { id: docRef.id, message: 'تم الاشتراك بنجاح' };
}

export async function unsubscribeEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const q = query(collection(db, COLLECTION), where('email', '==', normalizedEmail));
  const snap = await getDocs(q);
  if (snap.empty) return false;
  await updateDoc(doc(db, COLLECTION, snap.docs[0].id), {
    status: 'unsubscribed',
    unsubscribedAt: Date.now()
  });
  return true;
}

export function subscribeSubscribers(callback) {
  return onSnapshot(collection(db, COLLECTION), (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(items);
  });
}

export async function deleteSubscriber(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

// ============================================================
// Auto-init Newsletter Forms on page
// ============================================================
export function initNewsletterForms() {
  document.querySelectorAll('[data-newsletter-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const msgEl = form.querySelector('[data-newsletter-msg]');
      if (!emailInput || !submitBtn) return;

      const email = emailInput.value.trim();
      const source = form.dataset.source || 'inline';

      submitBtn.disabled = true;
      const orig = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      try {
        const result = await subscribeEmail(email, { source });
        if (msgEl) {
          msgEl.textContent = '✅ ' + result.message;
          msgEl.className = 'text-[11px] text-green-400 mt-2 font-bold';
        }
        emailInput.value = '';
        if (window.gtag) window.gtag('event', 'newsletter_signup', { source });
      } catch (err) {
        if (msgEl) {
          msgEl.textContent = '⚠️ ' + (err.message || 'تعذر الاشتراك');
          msgEl.className = 'text-[11px] text-red-400 mt-2 font-bold';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = orig;
      }
    });
  });
}
