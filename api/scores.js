// Leaderboard API — GET & POST scores
// TODO: Replace in-memory store with MongoDB/Supabase for production.
// This in-memory approach resets on cold starts (Vercel serverless).

/** @type {Array<{address:string, herotag:string|null, score:number, bananas:number, distance:number, perks:object, timestamp:number}>} */
let scores = [];

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const limit = Math.min(parseInt(req.query?.limit || '20', 10), 100);
    const sorted = [...scores].sort((a, b) => b.score - a.score).slice(0, limit);
    return res.status(200).json({ scores: sorted });
  }

  if (req.method === 'POST') {
    const { address, herotag, score, bananas, distance, perks } = req.body || {};

    if (!address || typeof score !== 'number') {
      return res.status(400).json({ error: 'Missing required fields: address, score' });
    }

    const entry = {
      address,
      herotag: herotag || null,
      score: Math.floor(score),
      bananas: Math.floor(bananas || 0),
      distance: Math.floor(distance || 0),
      perks: perks || {},
      timestamp: Date.now(),
    };

    scores.push(entry);

    // Keep only top 500 to prevent memory bloat
    if (scores.length > 500) {
      scores.sort((a, b) => b.score - a.score);
      scores = scores.slice(0, 500);
    }

    return res.status(201).json({ success: true, entry });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
