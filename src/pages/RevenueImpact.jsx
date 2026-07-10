import { useState, useEffect } from 'react'
import { DollarSign, TrendingDown, Zap, CheckCircle2, Loader2, Settings2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useSite } from '../context/SiteContext'

const severityColor = {
  critical: 'text-red-600 bg-red-50 border-red-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  low: 'text-gray-500 bg-gray-50 border-gray-200',
}

function getSeverity(rate) {
  if (rate >= 60) return 'critical'
  if (rate >= 45) return 'high'
  if (rate >= 30) return 'medium'
  return 'low'
}

function fmt(n) { return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}` }

export default function RevenueImpact() {
  const { currentSite } = useSite()
  const [exitPoints, setExitPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [mrr, setMrr] = useState(() => Number(localStorage.getItem('ci_mrr') || 5000))
  const [showMrrInput, setShowMrrInput] = useState(false)
  const [mrrDraft, setMrrDraft] = useState('')

  useEffect(() => {
    if (!currentSite) { setLoading(false); return }
    fetchData()
  }, [currentSite])

  async function fetchData() {
    setLoading(true)
    const since = new Date()
    since.setDate(since.getDate() - 30)

    const { data, error } = await supabase
      .from('events')
      .select('type, url, session_id')
      .eq('site_id', currentSite.id)
      .gte('occurred_at', since.toISOString())

    if (!error && data) {
      const pageviews = data.filter(e => e.type === 'pageview')
      const exits = data.filter(e => e.type === 'exit')

      const pageStats = {}
      pageviews.forEach(e => {
        const path = e.url ? (() => { try { return new URL(e.url).pathname } catch { return e.url } })() : '/'
        if (!pageStats[path]) pageStats[path] = { pageviews: 0, exits: 0, sessions: new Set() }
        pageStats[path].pageviews++
        pageStats[path].sessions.add(e.session_id)
      })
      exits.forEach(e => {
        const path = e.url ? (() => { try { return new URL(e.url).pathname } catch { return e.url } })() : '/'
        if (pageStats[path]) pageStats[path].exits++
      })

      const totalSessions = new Set(data.map(e => e.session_id)).size
      const revenuePerSession = totalSessions > 0 ? mrr / totalSessions : 0

      const points = Object.entries(pageStats)
        .filter(([, s]) => s.pageviews >= 2)
        .map(([page, s]) => {
          const rate = Math.round((s.exits / s.pageviews) * 100)
          const lostSessions = Math.round(s.sessions.size * (rate / 100))
          const lostMRR = Math.round(lostSessions * revenuePerSession)
          return {
            page,
            visitors: s.sessions.size,
            exitRate: rate,
            lostMRR,
            lostARR: lostMRR * 12,
            severity: getSeverity(rate),
          }
        })
        .filter(p => p.exitRate > 0)
        .sort((a, b) => b.lostMRR - a.lostMRR)
        .slice(0, 8)

      setExitPoints(points)
      if (points.length > 0) setSelected(points[0].page)
    }
    setLoading(false)
  }

  function saveMrr() {
    const val = parseInt(mrrDraft)
    if (val > 0) {
      setMrr(val)
      localStorage.setItem('ci_mrr', val)
    }
    setShowMrrInput(false)
    fetchData()
  }

  const totalLostMRR = exitPoints.reduce((s, p) => s + p.lostMRR, 0)
  const totalLostARR = totalLostMRR * 12
  const selectedPoint = exitPoints.find(p => p.page === selected)

  if (!currentSite || (!loading && exitPoints.length === 0)) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-24 text-center">
        <DollarSign size={32} className="text-gray-300 mb-4" />
        <p className="text-gray-500 text-sm">
          {!currentSite ? 'Select a site to view revenue impact.' : 'Not enough data yet. Keep the tracker running and check back soon.'}
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Revenue Impact</h1>
          <p className="text-gray-400 text-sm mt-0.5">{currentSite?.domain} · last 30 days</p>
        </div>
        <button
          onClick={() => { setMrrDraft(String(mrr)); setShowMrrInput(v => !v) }}
          className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings2 size={14} /> MRR: ${mrr.toLocaleString()}
        </button>
      </div>

      {showMrrInput && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <span className="text-sm text-gray-600">Your current MRR ($):</span>
          <input
            type="number"
            value={mrrDraft}
            onChange={e => setMrrDraft(e.target.value)}
            className="w-32 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="5000"
          />
          <button onClick={saveMrr} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
            Save
          </button>
          <span className="text-xs text-gray-400">Used to estimate revenue at risk per exit</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 size={28} className="text-blue-500 animate-spin" /></div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-100 rounded-xl p-5">
              <p className="text-xs text-red-400 font-medium mb-1">MRR at Risk</p>
              <p className="text-3xl font-bold text-red-600">{fmt(totalLostMRR)}</p>
              <p className="text-xs text-red-400 mt-1">from exit page drop-off</p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
              <p className="text-xs text-orange-400 font-medium mb-1">ARR at Risk</p>
              <p className="text-3xl font-bold text-orange-600">{fmt(totalLostARR)}</p>
              <p className="text-xs text-orange-400 mt-1">annualised</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <p className="text-xs text-blue-400 font-medium mb-1">Exit Points</p>
              <p className="text-3xl font-bold text-blue-600">{exitPoints.length}</p>
              <p className="text-xs text-blue-400 mt-1">pages leaking revenue</p>
            </div>
          </div>

          {/* Exit points list + detail */}
          <div className="grid grid-cols-5 gap-4">
            {/* List */}
            <div className="col-span-2 space-y-2">
              {exitPoints.map(p => (
                <button
                  key={p.page}
                  onClick={() => setSelected(p.page)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selected === p.page
                      ? 'border-blue-300 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${severityColor[p.severity]}`}>
                      {p.severity}
                    </span>
                    <span className="text-xs text-gray-400">{p.exitRate}% exit</span>
                  </div>
                  <p className="text-sm font-mono text-gray-700 truncate">{p.page}</p>
                  <p className="text-xs text-gray-400 mt-1">{fmt(p.lostMRR)}/mo at risk</p>
                </button>
              ))}
            </div>

            {/* Detail */}
            {selectedPoint && (
              <div className="col-span-3 bg-white border border-gray-200 rounded-xl p-6 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${severityColor[selectedPoint.severity]}`}>
                      {selectedPoint.severity}
                    </span>
                    <TrendingDown size={16} className="text-red-400" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 font-mono">{selectedPoint.page}</h2>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Visitors</p>
                    <p className="text-xl font-bold text-gray-900">{selectedPoint.visitors.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Exit Rate</p>
                    <p className="text-xl font-bold text-red-500">{selectedPoint.exitRate}%</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-red-400">Lost MRR</p>
                    <p className="text-xl font-bold text-red-600">{fmt(selectedPoint.lostMRR)}</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} className="text-amber-500" />
                    <span className="text-xs font-semibold text-amber-700">What this means</span>
                  </div>
                  <p className="text-sm text-amber-800">
                    {selectedPoint.exitRate}% of visitors who reach <span className="font-mono font-medium">{selectedPoint.page}</span> leave without converting.
                    Based on your MRR of ${mrr.toLocaleString()}, this page is costing you approximately <strong>{fmt(selectedPoint.lostMRR)}/month</strong>.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Suggested actions</p>
                  <ul className="space-y-2">
                    {[
                      'Add social proof (testimonials, logos) near the exit zone',
                      'Simplify the page — reduce friction and cognitive load',
                      'A/B test your headline and primary CTA',
                      'Add a chat widget or exit-intent popup',
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
