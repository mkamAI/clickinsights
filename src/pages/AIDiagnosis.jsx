import { useState, useEffect } from 'react'
import { Brain, Zap, CheckCircle2, AlertTriangle, Sparkles, Loader2, RefreshCw, KeyRound } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useSite } from '../context/SiteContext'

const severityColors = {
  critical: { badge: 'text-red-600 bg-red-50 border-red-200', bar: 'bg-red-500' },
  high:     { badge: 'text-orange-600 bg-orange-50 border-orange-200', bar: 'bg-orange-500' },
  medium:   { badge: 'text-yellow-600 bg-yellow-50 border-yellow-200', bar: 'bg-yellow-400' },
  low:      { badge: 'text-gray-500 bg-gray-50 border-gray-200', bar: 'bg-gray-400' },
}

const effortColor = {
  Quick:  'text-emerald-600 bg-emerald-50 border-emerald-200',
  Medium: 'text-blue-600 bg-blue-50 border-blue-200',
  Hard:   'text-purple-600 bg-purple-50 border-purple-200',
}

export default function AIDiagnosis() {
  const { currentSite } = useSite()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [lastRun, setLastRun] = useState(null)

  // Auto-run when site changes (if we have a cached result or first load)
  useEffect(() => {
    if (currentSite) runDiagnosis()
  }, [currentSite])

  async function fetchMetrics() {
    const since = new Date()
    since.setDate(since.getDate() - 30)

    const { data, error } = await supabase
      .from('events')
      .select('session_id, type, url, x_pct, y_pct, scroll_depth, rage_click')
      .eq('site_id', currentSite.id)
      .gte('occurred_at', since.toISOString())

    if (error) throw error
    return data || []
  }

  async function runDiagnosis() {
    if (!currentSite) return
    setLoading(true)
    setError('')

    try {
      const events = await fetchMetrics()

      if (events.length < 10) {
        setError('Not enough data yet. Need at least 10 events to run a diagnosis. Visit your site a few times with the tracker installed.')
        setLoading(false)
        return
      }

      // Compute page-level metrics
      const pageStats = {}
      events.filter(e => e.type === 'pageview').forEach(e => {
        const path = e.url ? (() => { try { return new URL(e.url).pathname } catch { return e.url } })() : '/'
        if (!pageStats[path]) pageStats[path] = { pageviews: 0, exits: 0, scrolls: [], sessions: new Set() }
        pageStats[path].pageviews++
        pageStats[path].sessions.add(e.session_id)
        if (e.scroll_depth != null) pageStats[path].scrolls.push(e.scroll_depth)
      })
      events.filter(e => e.type === 'exit').forEach(e => {
        const path = e.url ? (() => { try { return new URL(e.url).pathname } catch { return e.url } })() : '/'
        if (pageStats[path]) pageStats[path].exits++
      })

      // Rage clicks per page
      const rageMap = {}
      events.filter(e => e.rage_click && e.url).forEach(e => {
        const path = (() => { try { return new URL(e.url).pathname } catch { return e.url } })()
        rageMap[path] = (rageMap[path] || 0) + 1
      })

      const exitPages = Object.entries(pageStats)
        .filter(([, s]) => s.pageviews >= 3)
        .map(([page, s]) => ({
          page,
          pageviews: s.pageviews,
          exits: s.exits,
          exitRate: Math.round((s.exits / s.pageviews) * 100),
          avgScroll: s.scrolls.length > 0 ? Math.round(s.scrolls.reduce((a, b) => a + b, 0) / s.scrolls.length) : null,
        }))
        .filter(p => p.exitRate > 0)
        .sort((a, b) => b.exits - a.exits)

      const ragePages = Object.entries(rageMap)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)

      const totalSessions = new Set(events.map(e => e.session_id)).size
      const totalPageviews = events.filter(e => e.type === 'pageview').length
      const totalExits = events.filter(e => e.type === 'exit').length

      // Call AI
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: currentSite.domain,
          totalSessions,
          totalPageviews,
          totalExits,
          exitPages,
          ragePages,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setError(data.error || 'Diagnosis failed.')
        setLoading(false)
        return
      }

      setResult(data)
      setSelected(data.diagnoses?.[0]?.page || null)
      setLastRun(new Date())
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (!currentSite) {
    return (
      <div className="p-6 flex items-center justify-center py-24">
        <p className="text-gray-400 text-sm">Select a site to run AI diagnosis.</p>
      </div>
    )
  }

  const diagnosis = result?.diagnoses?.find(d => d.page === selected)

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Brain size={20} className="text-blue-600" /> AI Diagnosis
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {currentSite.domain} · {lastRun ? `Last run ${lastRun.toLocaleTimeString()}` : 'Analysing your real visitor data'}
          </p>
        </div>
        <button
          onClick={runDiagnosis}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {loading ? 'Analysing…' : 'Re-run'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium text-blue-700">Claude is analysing your visitor data…</p>
            <p className="text-xs text-blue-500 mt-1">Fetching events, computing exit rates, generating diagnoses</p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            {error.includes('ANTHROPIC_API_KEY') ? <KeyRound size={18} className="text-red-500 mt-0.5" /> : <AlertTriangle size={18} className="text-red-500 mt-0.5" />}
            <div>
              <p className="text-sm font-medium text-red-700">{error.includes('ANTHROPIC_API_KEY') ? 'API key missing' : 'Diagnosis error'}</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              {error.includes('ANTHROPIC_API_KEY') && (
                <p className="text-xs text-red-500 mt-2">
                  Go to <strong>Vercel → Settings → Environment Variables</strong> and add <code className="bg-red-100 px-1 rounded">ANTHROPIC_API_KEY</code> with your key from console.anthropic.com, then redeploy.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && result && (
        <>
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-blue-500" />
              <span className="text-sm font-semibold text-blue-700">AI Summary</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
          </div>

          {/* Two-panel layout */}
          <div className="grid grid-cols-5 gap-4">
            {/* Left: diagnosis list */}
            <div className="col-span-2 space-y-2">
              {result.diagnoses?.map(d => (
                <button
                  key={d.page}
                  onClick={() => setSelected(d.page)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selected === d.page
                      ? 'border-blue-300 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${severityColors[d.severity]?.badge}`}>
                      {d.severity}
                    </span>
                    <span className="text-xs text-gray-400">{d.confidence}% confidence</span>
                  </div>
                  <p className="text-xs font-mono text-gray-700 truncate">{d.page}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{d.rootCause}</p>
                </button>
              ))}
            </div>

            {/* Right: selected diagnosis detail */}
            {diagnosis && (
              <div className="col-span-3 bg-white border border-gray-200 rounded-xl p-6 space-y-5">
                {/* Confidence bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">AI Confidence</span>
                    <span className="text-xs font-semibold text-gray-700">{diagnosis.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${severityColors[diagnosis.severity]?.bar}`}
                      style={{ width: `${diagnosis.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Root cause */}
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded border font-medium ${severityColors[diagnosis.severity]?.badge}`}>
                    {diagnosis.severity}
                  </span>
                  <h2 className="text-base font-bold text-gray-900 mt-2 font-mono">{diagnosis.page}</h2>
                  <div className="flex items-start gap-2 mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <Zap size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-amber-800">{diagnosis.rootCause}</p>
                  </div>
                </div>

                {/* Detail */}
                <p className="text-sm text-gray-600 leading-relaxed">{diagnosis.detail}</p>

                {/* Patterns */}
                {diagnosis.patterns?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Observed Patterns</p>
                    <div className="flex flex-wrap gap-2">
                      {diagnosis.patterns.map((p, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{p}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fixes */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Recommended Fixes</p>
                  <div className="space-y-2.5">
                    {diagnosis.fixes?.map((fix, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700">{fix.label}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${effortColor[fix.effort] || effortColor.Medium}`}>
                              {fix.effort}
                            </span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500">{fix.impact} impact</span>
                            {fix.days > 0 && (
                              <>
                                <span className="text-xs text-gray-400">·</span>
                                <span className="text-xs text-gray-400">~{fix.days}d</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
