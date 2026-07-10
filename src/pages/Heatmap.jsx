import { useState, useEffect, useRef } from 'react'
import { Flame, MousePointer, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useSite } from '../context/SiteContext'

function HeatDot({ x, y, intensity }) {
  const size = 40 + intensity * 60
  const opacity = 0.15 + intensity * 0.55
  const color = intensity > 0.7 ? '#ef4444' : intensity > 0.4 ? '#f97316' : '#facc15'
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    />
  )
}

export default function Heatmap() {
  const { currentSite } = useSite()
  const [pages, setPages] = useState([])
  const [selectedPage, setSelectedPage] = useState('')
  const [clicks, setClicks] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('click') // 'click' | 'scroll'
  const [scrollData, setScrollData] = useState([])

  useEffect(() => {
    if (!currentSite) { setLoading(false); return }
    fetchPages()
  }, [currentSite])

  useEffect(() => {
    if (selectedPage) fetchClickData()
  }, [selectedPage, mode])

  async function fetchPages() {
    setLoading(true)
    const since = new Date()
    since.setDate(since.getDate() - 7)

    const { data } = await supabase
      .from('events')
      .select('url')
      .eq('site_id', currentSite.id)
      .eq('type', 'click')
      .gte('occurred_at', since.toISOString())
      .not('url', 'is', null)

    if (data) {
      const uniquePages = [...new Set(
        data.map(e => { try { return new URL(e.url).pathname } catch { return e.url } })
      )]
      setPages(uniquePages)
      if (uniquePages.length > 0) setSelectedPage(uniquePages[0])
    }
    setLoading(false)
  }

  async function fetchClickData() {
    const since = new Date()
    since.setDate(since.getDate() - 7)

    const { data } = await supabase
      .from('events')
      .select('x_pct, y_pct, scroll_depth')
      .eq('site_id', currentSite.id)
      .eq('type', mode === 'scroll' ? 'exit' : 'click')
      .gte('occurred_at', since.toISOString())
      .not('x_pct', 'is', null)

    if (data) {
      if (mode === 'click') {
        // Normalize click density
        const max = data.length || 1
        const grouped = {}
        data.forEach(e => {
          const key = `${Math.round(e.x_pct / 5) * 5}_${Math.round(e.y_pct / 5) * 5}`
          grouped[key] = (grouped[key] || 0) + 1
        })
        const maxCount = Math.max(...Object.values(grouped), 1)
        setClicks(
          Object.entries(grouped).map(([key, count]) => {
            const [x, y] = key.split('_').map(Number)
            return { x, y, intensity: count / maxCount }
          })
        )
      } else {
        // Scroll depth histogram
        const buckets = Array.from({ length: 10 }, (_, i) => ({ pct: (i + 1) * 10, depth: 0, count: 0 }))
        data.forEach(e => {
          if (e.scroll_depth != null) {
            const bucket = Math.min(9, Math.floor(e.scroll_depth / 10))
            buckets[bucket].count++
          }
        })
        const maxCount = Math.max(...buckets.map(b => b.count), 1)
        setScrollData(buckets.map(b => ({ ...b, depth: Math.round((b.count / maxCount) * 100) })))
      }
    }
  }

  if (!currentSite) {
    return (
      <div className="p-6 flex items-center justify-center py-24">
        <p className="text-gray-400 text-sm">Select a site to view heatmaps.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Heatmap</h1>
          <p className="text-gray-400 text-sm mt-0.5">{currentSite?.domain} · last 7 days</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Page selector */}
          {pages.length > 0 && (
            <select
              value={selectedPage}
              onChange={e => setSelectedPage(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pages.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[{ id: 'click', icon: MousePointer, label: 'Clicks' }, { id: 'scroll', icon: Flame, label: 'Scroll' }].map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mode === m.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <m.icon size={12} />{m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 size={28} className="text-blue-500 animate-spin" /></div>
      ) : pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <MousePointer size={32} className="text-gray-300 mb-4" />
          <p className="text-gray-400 text-sm">No click data yet. Visit your site with the tracker installed to generate heatmap data.</p>
        </div>
      ) : mode === 'click' ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <MousePointer size={14} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Click Heatmap — {selectedPage}</span>
            <span className="ml-auto text-xs text-gray-400">{clicks.length} hotspots from real clicks</span>
          </div>
          <div className="relative bg-gray-50 overflow-hidden" style={{ height: 480 }}>
            {/* Page mockup grid */}
            <div className="absolute inset-0 opacity-10">
              {[15, 35, 55, 75].map(y => (
                <div key={y} className="absolute left-8 right-8 h-6 bg-gray-400 rounded" style={{ top: `${y}%` }} />
              ))}
            </div>
            {clicks.map((dot, i) => (
              <HeatDot key={i} x={dot.x} y={dot.y} intensity={dot.intensity} />
            ))}
            {clicks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400 text-sm">No click events for this page yet</p>
              </div>
            )}
          </div>
          {/* Legend */}
          <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-4">
            <span className="text-xs text-gray-400">Intensity:</span>
            {[['Low', '#facc15'], ['Medium', '#f97316'], ['High', '#ef4444']].map(([label, color]) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />{label}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <Flame size={14} className="text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Scroll Depth — {selectedPage}</span>
          </div>
          <div className="p-6">
            {scrollData.every(b => b.count === 0) ? (
              <p className="text-gray-400 text-sm text-center py-8">No scroll data yet for this page.</p>
            ) : (
              <div className="space-y-2">
                {scrollData.map(b => (
                  <div key={b.pct} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-10 text-right">{b.pct}%</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full rounded transition-all"
                        style={{
                          width: `${b.depth}%`,
                          background: b.depth > 70 ? '#3b82f6' : b.depth > 40 ? '#f97316' : '#ef4444',
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{b.count}</span>
                  </div>
                ))}
                <p className="text-xs text-gray-400 mt-4">
                  Each bar shows how many sessions reached that scroll depth. A sharp drop = content problem.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
