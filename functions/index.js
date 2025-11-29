// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const fetch = require('node-fetch'); // v2
const bodyParser = require('body-parser');

admin.initializeApp();

const app = express();
app.use(bodyParser.json({ limit: '256kb' }));

const NEYSA_KEY = functions.config().neysa && functions.config().neysa.key;
const NEYSA_ENDPOINT = functions.config().neysa && functions.config().neysa.endpoint;

if (!NEYSA_KEY || !NEYSA_ENDPOINT) {
  console.warn('NEYSA_KEY or NEYSA_ENDPOINT not configured in functions config.');
}

// Verify Firebase ID token middleware
async function verifyFirebaseIdToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.*)/);
  if (!match) return res.status(401).json({ error: 'Unauthorized: missing token' });
  const idToken = match[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error('Token verification error', err);
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

// Basic sanitization - strip common PII patterns
function sanitizeText(text = '') {
  let out = String(text);
  out = out.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[EMAIL]');
  out = out.replace(/\b\d{10}\b/g, '[PHONE]');
  out = out.replace(/\b\d{12}\b/g, '[ID]');
  out = out.replace(/\b\d{4,}\b/g, (m) => (m.length > 6 ? '[REDACTED_NUM]' : m));
  return out;
}

// Adjust this builder if Neysa expects a different payload shape.
function buildNeysaPayload({ messages, model, temperature }) {
  return {
    model,
    input: { messages },
    parameters: { temperature }
  };
}

app.post('/infer', verifyFirebaseIdToken, async (req, res) => {
  try {
    const { messages, model, temperature = 0.2 } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' });
    }

    // sanitize message content
    const sanitized = messages.map(m => ({
      role: m.role,
      content: sanitizeText(m.content)
    }));

    const payload = buildNeysaPayload({ messages: sanitized, model, temperature });

    const resp = await fetch(NEYSA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEYSA_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const text = await resp.text();
    let json;
    try { json = JSON.parse(text); } catch (e) { json = { raw: text }; }

    // optional: post-filter response for PII
    if (json && typeof json === 'object') {
      const str = JSON.stringify(json)
        .replace(/\b\d{10}\b/g, '[PHONE]')
        .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,'[EMAIL]');
      try { json = JSON.parse(str); } catch { json = { raw: str }; }
    }

    // normalize success code
    const status = resp.status >= 200 && resp.status < 300 ? 200 : resp.status;
    return res.status(status).json(json);
  } catch (err) {
    console.error('Proxy error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
});

exports.api = functions.https.onRequest(app);
