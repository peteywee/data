import { Router } from 'express';
import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';

const router = Router();
const LOG_FILE = '.data/compliance.log';

async function logEvent(event: any) {
  await mkdir(dirname(LOG_FILE), { recursive: true });
  const line = JSON.stringify({ ts: new Date().toISOString(), ...event }) + '\n';
  await fs.appendFile(LOG_FILE, line, 'utf8');
}

// robots.txt
router.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow:');
});

// .well-known/security.txt (RFC9116)
router.get('/.well-known/security.txt', (_req, res) => {
  const contact = process.env.CONTACT_EMAIL || 'security@example.com';
  res.type('text/plain').send(
`Contact: mailto:${contact}
Policy: /security
Preferred-Languages: en
`);
});

// Privacy (env override supported)
router.get('/privacy', (_req, res) => {
  const txt = (process.env.PRIVACY_TEXT || '').trim() ||
`Privacy Policy – Global Law Governance System (GLGS)
Effective Date: March 2025

This application (GPT: “Data”) does not store, sell, share, or retain any user data. All data is processed in real-time for the purpose of execution filtering, compliance validation, and logic automation.

Data Usage
- No personal or private information is collected.
- All uploaded files are processed transiently and not saved beyond active use.
- API calls are routed only to user-configured endpoints (e.g., localhost).`;
  res.type('text/plain').send(txt);
});

router.get('/terms', (_req, res) => {
  const txt = (process.env.TERMS_TEXT || '').trim() ||
`Terms of Service
Use this service at your own discretion. No unlawful or prohibited use. No scraping abuse. No resale without permission.`;
  res.type('text/plain').send(txt);
});

router.get('/cookies', (_req, res) => {
  const txt = (process.env.COOKIES_TEXT || '').trim() ||
`Cookies Policy
We don't set tracking cookies. If cookies are introduced for session security, they will be essential-only.`;
  res.type('text/plain').send(txt);
});

router.get('/security', (_req, res) => {
  res.json({
    encryption: 'TLS (behind your terminator)',
    data_storage: 'Minimal; operational logs only if enabled',
    auth: 'Per-connector API keys; least privilege',
    isolation: 'SFW/NSFW lanes; no cross-pixel or repo sharing'
  });
});

router.get('/status', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString(), versions: { api: 'v0.1.0' } });
});

// GDPR/CCPA log-only stubs
router.post('/gdpr/export', async (req, res) => {
  const who = req.body?.subject || 'anonymous';
  await logEvent({ type: 'gdpr_export_request', who });
  res.json({ received: true, action: 'export', subject: who });
});

router.post('/gdpr/delete', async (req, res) => {
  const who = req.body?.subject || 'anonymous';
  await logEvent({ type: 'gdpr_delete_request', who });
  res.json({ received: true, action: 'delete', subject: who });
});

router.post('/ccpa/opt-out', async (req, res) => {
  const who = req.body?.subject || 'anonymous';
  await logEvent({ type: 'ccpa_opt_out', who });
  res.json({ received: true, action: 'opt-out', subject: who });
});

export default router;
