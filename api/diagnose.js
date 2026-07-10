/**
 * Vercel Serverless Function — POST /api/diagnose
 * Sends real site metrics to Claude and returns AI-generated CRO diagnoses.
 * Requires ANTHROPIC_API_KEY in Vercel environment variables.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured in Vercel environment variables.' })
  }

  const { domain, totalSessions, totalPageviews, totalExits, exitPages, ragePages } = req.body

  if (!exitPages || exitPages.length === 0) {
    return res.status(400).json({ error: 'No exit data to diagnose.' })
  }

  const exitPagesSummary = exitPages
    .slice(0, 8)
    .map(p => `  - ${p.page}: ${p.exitRate}% exit rate, ${p.exits} exits from ${p.pageviews} pageviews, avg scroll: ${p.avgScroll ?? 'unknown'}%`)
    .join('\n')

  const ragePagesSummary = ragePages && ragePages.length > 0
    ? ragePages.map(p => `  - ${p.page}: ${p.count} rage click sessions`).join('\n')
    : '  None detected'

  const prompt = `You are a senior conversion rate optimization (CRO) expert. Analyze this real visitor data and diagnose exactly why visitors are leaving without converting.

SITE: ${domain}
PERIOD: Last 30 days
TOTAL SESSIONS: ${totalSessions}
TOTAL PAGEVIEWS: ${totalPageviews}
TOTAL EXIT EVENTS: ${totalExits}

TOP EXIT PAGES (sorted by exit count):
${exitPagesSummary}

RAGE CLICK PAGES (frustrated clicks):
${ragePagesSummary}

Respond ONLY with valid JSON. No markdown, no explanation outside the JSON. Use this exact structure:
{
  "summary": "2-3 sentence overall diagnosis of the biggest conversion problem",
  "diagnoses": [
    {
      "page": "/exact-path",
      "severity": "critical",
      "confidence": 87,
      "rootCause": "One specific, concrete root cause based on the data",
      "detail": "2-3 sentences explaining what the data indicates and why visitors are leaving this specific page",
      "patterns": ["Data pattern 1 from the metrics", "Data pattern 2"],
      "fixes": [
        { "label": "Specific actionable fix", "effort": "Quick", "impact": "High", "days": 1 },
        { "label": "Second fix", "effort": "Medium", "impact": "High", "days": 3 }
      ]
    }
  ]
}

Rules:
- severity must be "critical" (>60% exit), "high" (45-60%), "medium" (30-45%), or "low" (<30%)
- confidence is 0-100 based on how much data supports the diagnosis
- effort is "Quick" (<1 day), "Medium" (1-5 days), or "Hard" (>5 days)
- impact is "High", "Medium", or "Low"
- Only diagnose pages with meaningful traffic (>5 pageviews)
- Be specific — reference actual numbers from the data
- fixes must be concrete and actionable, not generic advice`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[diagnose] Anthropic error:', err)
      return res.status(500).json({ error: 'AI diagnosis failed. Check your ANTHROPIC_API_KEY.' })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    // Parse the JSON from Claude's response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[diagnose] Could not parse JSON from Claude response:', text)
      return res.status(500).json({ error: 'AI returned unexpected format.' })
    }

    const result = JSON.parse(jsonMatch[0])
    return res.status(200).json(result)
  } catch (err) {
    console.error('[diagnose]', err)
    return res.status(500).json({ error: err.message })
  }
}
