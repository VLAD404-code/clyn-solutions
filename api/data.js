/**
 * Shared site data API — GET public data, POST save (admin password)
 * Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set; falls back to in-repo JSON path notes.
 */
const PATH = 'clyn-live-data.json';
const ADMIN_PASS = process.env.CLYN_ADMIN_PASSWORD || 'clyn2026';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function blobPut(json) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  const url = `https://blob.vercel-storage.com/${PATH}?access=public&allowOverwrite=1`;
  const r = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-content-type': 'application/json',
      'x-vercel-blob-access': 'public'
    },
    body: typeof json === 'string' ? json : JSON.stringify(json)
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error('Blob put failed: ' + r.status + ' ' + t);
  }
  return r.json();
}

async function blobGet() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  // List to find URL
  const listUrl = 'https://blob.vercel-storage.com?limit=20&prefix=clyn-live';
  const lr = await fetch(listUrl, { headers: { Authorization: `Bearer ${token}` } });
  if (!lr.ok) return null;
  const listed = await lr.json();
  const blobs = listed.blobs || [];
  const hit = blobs.find(b => (b.pathname || '').includes('clyn-live-data')) || blobs[0];
  if (!hit || !hit.url) return null;
  const gr = await fetch(hit.url + (hit.url.includes('?') ? '&' : '?') + 't=' + Date.now());
  if (!gr.ok) return null;
  return gr.json();
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method === 'GET') {
    try {
      const data = await blobGet();
      if (data) {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(data));
      }
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: true, empty: true }));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: String(e.message || e) }));
    }
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
      }
      if (!body || typeof body !== 'object') body = {};
      const pass = body.password || body.adminPassword || '';
      if (pass !== ADMIN_PASS) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: 'Unauthorized' }));
      }
      const payload = {
        products: body.products || [],
        categories: body.categories || [],
        settings: body.settings || {},
        promotions: body.promotions || [],
        users: body.users || [],
        logs: body.logs || [],
        analytics: body.analytics || { totalViews: 0, pages: {}, visits: [] },
        updatedAt: new Date().toISOString()
      };
      const result = await blobPut(payload);
      if (!result) {
        res.statusCode = 503;
        return res.end(JSON.stringify({
          error: 'Cloud storage not configured. Add BLOB_READ_WRITE_TOKEN on Vercel.'
        }));
      }
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: true, url: result.url, updatedAt: payload.updatedAt }));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: String(e.message || e) }));
    }
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
};
