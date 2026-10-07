// ============================================================
// Auto-publish scheduled posts
// Runs on GitHub Actions (every hour)
// ============================================================

const PROJECT_ID = 'my-website-e5b7e';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function fetchCollection(name) {
  try {
    const url = `${FIRESTORE_BASE}/${name}?pageSize=300`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents) return [];
    return data.documents.map(doc => {
      const id = doc.name.split('/').pop();
      return { id, _path: doc.name, ...parseFields(doc.fields || {}) };
    });
  } catch (err) {
    console.error(`❌ Error fetching ${name}:`, err.message);
    return [];
  }
}

function parseFields(fields) {
  const result = {};
  for (const [key, val] of Object.entries(fields)) {
    result[key] = parseValue(val);
  }
  return result;
}

function parseValue(val) {
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return parseFloat(val.doubleValue);
  if ('booleanValue' in val) return val.booleanValue;
  if ('timestampValue' in val) return val.timestampValue;
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) return (val.arrayValue.values || []).map(parseValue);
  if ('mapValue' in val) return parseFields(val.mapValue.fields || {});
  return null;
}

// ============================================================
// Update a document field via REST API (PATCH)
// ============================================================
async function updateDoc(docId, updates) {
  const url = `${FIRESTORE_BASE}/blog/${docId}?updateMask.fieldPaths=${Object.keys(updates).join('&updateMask.fieldPaths=')}`;
  
  const fields = {};
  for (const [key, val] of Object.entries(updates)) {
    fields[key] = toFirestoreValue(val);
  }

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update ${docId}: ${res.status} ${text}`);
  }
  return await res.json();
}

function toFirestoreValue(val) {
  if (val === null) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === 'boolean') return { booleanValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  return { stringValue: String(val) };
}

async function main() {
  console.log('⏰ Checking scheduled posts...');
  console.log(`📅 Now: ${new Date().toISOString()}`);

  const posts = await fetchCollection('blog');
  console.log(`📚 Found ${posts.length} posts`);

  const now = Date.now();
  let publishedCount = 0;

  for (const post of posts) {
    if (post.status !== 'scheduled') continue;
    if (!post.scheduledAt) continue;

    const scheduledTime = new Date(post.scheduledAt).getTime();
    if (isNaN(scheduledTime)) continue;

    if (scheduledTime <= now) {
      console.log(`✅ Publishing: "${post.title}" (scheduled for ${post.scheduledAt})`);
      try {
        await updateDoc(post.id, {
          status: 'published',
          publishedAt: Date.now(),
          updatedAt: Date.now()
        });
        publishedCount++;
      } catch (err) {
        console.error(`❌ Failed to publish ${post.id}:`, err.message);
      }
    } else {
      const minutesLeft = Math.round((scheduledTime - now) / 60000);
      console.log(`⏳ Still waiting: "${post.title}" (${minutesLeft} min left)`);
    }
  }

  console.log(`\n🎉 Done! Published ${publishedCount} post(s).`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
