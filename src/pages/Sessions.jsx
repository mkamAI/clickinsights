import { useState } from 'react'
import { Play, Monitor, Smartphone, Globe, Clock, TrendingDown, Search, Filter } from 'lucide-react'

const sessions = [
  { id: 's001', country: '🇺🇸', device: 'desktop', duration: '4m 12s', pages: 7, exitPage: '/pricing', score: 84, exitReason: 'Price shock', time: '2 min ago', rage: true },
  { id: 's002', country: '🇬🇧', device: 'mobile', duration: '1m 44s', pages: 3, exitPage: '/checkout/step-2', score: 71, exitReason: 'Form friction', time: '5 min ago', rage: true },
  { id: 's003', country: '🇩🇪', device: 'desktop', duration: '6m 30s', pages: 11, exitPage: '/product/pro-plan', score: 62, exitReason: 'No social proof', time: '9 min ago', rage: false },
  { id: 's004', country: '🇨🇦', device: 'mobile', duration: '0m 52s', pages: 2, exitPage: '/', score: 91, exitReason: 'Message mismatch', time: '14 min ago', rage: false },
  { id: 's005', country: '🇫🇷', device: 'desktop', duration: '3m 08s', pages: 5, exitPage: '/signup', score: 77, exitReason: 'Form too long', time: '18 min ago', rage: true },
  { id: 's006', country: '🇦🇺', device: 'tablet', duration: '2m 19s', pages: 4, exitPage: '/pricing', score: 55, exitReason: 'Price shock', time: '22 min ago', rage: false },
  { id: 's007', country: '🇳🇱', device: 'desktop', duration: '5m 41s', pages: 9, exitPage: '/product/pro-plan', score: 68, exitReason: 'Slow page load', time: '31 min ago', rage: true },
  { id: 's008', country: '🇧🇷', device: 'mobile', duration: '1m 03s', pages: 2, exitPage: '/signup', score: 82, exitReason: 'Form too long', time: '45 min ago', rage: false },
]

const scoreColor = (s) => {
  if (s >= 80) return 'text-red-400'
  if (s >= 60) return 'text-orange-400'
  return 'text-yellow-400'
}

const scoreBg = (s) => {
  if (s >= 80) return 'bg-red-500/10 border-red-500/20'
  if (s >= 60) return 'bg-orange-500/10 border-orange-500/20'
  return 'bg-yellow-500/10 border-yellow-500/20'
}

export default function Sessions() {
  const [search, setSearch] = useState('')
  const [deviceFilter, setDeviceFilter] = useState('all')

  const filtered = sessions.filter(s => {
    const matchSearch = s.exitPage.includes(search) || s.exitReason.toLowerCase().includes(search.toLowerCase())
    const matchDevice = deviceFilter === 'all' || s.device === deviceFilter
    return matchSearch && matchDevice
  })

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Session Recordings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Watch exactly what visitors did before leaving</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exit page or reason..."
            className="w-full bg-surface-card border border-surface-border rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex items-center gap-1 bg-surface-card border border-surface-border rounded-lg p-1">
          {['all', 'desktop', 'mobile', 'tablet'].map(d => (
            <button
              key={d}
              onClick={() => setDeviceFilter(d)}
              className={`px-3 py-1.5 text-xs rounded-md capitalize transition-all ${
                deviceFilter === d ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 bg-surface-card border border-surface-border rounded-lg hover:text-slate-200">
          <Filter size={13} /> Filter
        </button>
      </div>

      {/* Session list */}
      <div className="space-y-2">
        {filtered.map((s) => (
          <div key={s.id} className="bg-surface-card border border-surface-border rounded-xl px-5 py-4 hover:bg-surface-hover transition-colors group">
            <div className="flex items-center gap-4">
              {/* Play button */}
              <button className="w-9 h-9 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center group-hover:bg-brand-600/40 transition-colors flex-shrink-0">
                <Play size={14} className="text-brand-400 ml-0.5" />
              </button>

              {/* Meta */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-lg">{s.country}</span>
                {s.device === 'desktop'
                  ? <Monitor size={14} className="text-slate-500" />
                  : s.device === 'mobile'
                  ? <Smartphone size={14} className="text-slate-500" />
                  : <Globe size={14} className="text-slate-500" />}
              </div>

              {/* Session info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono">{s.id}</span>
                  {s.rage && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/20 text-red-400 font-medium">
                      RAGE CLICKS
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock size={11} /> {s.duration}</span>
                  <span>{s.pages} pages visited</span>
                  <span className="text-slate-600">exited: <span className="text-slate-400 font-mono">{s.exitPage}</span></span>
                </div>
              </div>

              {/* Exit reason */}
              <div className="hidden md:block text-right flex-shrink-0">
                <p className="text-xs text-slate-500 mb-0.5">Exit reason</p>
                <p className="text-xs font-medium text-slate-300">{s.exitReason}</p>
              </div>

              {/* Intent score */}
              <div className={`flex-shrink-0 w-16 h-16 rounded-xl border flex flex-col items-center justify-center ${scoreBg(s.score)}`}>
                <TrendingDown size={12} className={scoreColor(s.score)} />
                <p className={`text-lg font-bold ${scoreColor(s.score)}`}>{s.score}</p>
                <p className="text-[9px] text-slate-600">exit risk</p>
              </div>

              {/* Time */}
              <div className="text-xs text-slate-600 flex-shrink-0 w-16 text-right">{s.time}</div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-600">
          No sessions match your filters
        </div>
      )}

      <div className="text-center">
        <button className="text-xs text-brand-400 hover:text-brand-300 px-4 py-2 border border-brand-500/20 rounded-lg">
          Load more sessions
        </button>
      </div>
    </div>
  )
}
