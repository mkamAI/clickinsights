/**
 * Vercel Serverless Function — POST /api/track
 * Receives events from tracker.js and writes them to Supabase.
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use service role key server-side
);

export default async function handler(req, res) {
  // CORS — allow any origin (tracker runs on customer sites)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);

    const { siteId, sessionId, type, url, referrer, timestamp,
            screen, device, title, xPct, yPct, tag, text, rage,
            timeOnPage, scrollDepth } = body;

    if (!siteId || !sessionId || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await supabase.from('events').insert({
      site_id: siteId,
      session_id: sessionId,
      type,
      url,
      referrer,
      occurred_at: new Date(timestamp).toISOString(),
      screen,
      device,
      title,
      x_pct: xPct,
      y_pct: yPct,
      element_tag: tag,
      element_text: text,
      rage_click: rage,
      time_on_page: timeOnPage,
      scroll_depth: scrollDepth,
    });

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[track]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
