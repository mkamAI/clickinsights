import { useState } from 'react'
import { Flame, MousePointer, MoveHorizontal, ArrowDownUp } from 'lucide-react'

const pages = ['/pricing', '/product/pro-plan', '/checkout/step-2', '/signup', '/']

// Simulated hotspot data [x%, y%, intensity 0-1, label]
const clickData = [
  [50, 18, 0.95, 'CTA Button'],
  [50, 35, 0.72, 'Plan cards'],
  [28, 52, 0.45, 'FAQ toggle'],
  [72, 52, 0.38, 'Compare link'],
  [50, 68, 0.28, 'Footer nav'],
  [15, 25, 0.18, 'Nav logo'],
  [85, 22, 0.55, 'Sign in link'],
  [50, 80, 0.15, 'Terms link'],
]

const scrollData = [
  { pct: 0, depth: 100 },
  { pct: 10, depth: 91 },
  { pct: 25, depth: 76 },
  { pct: 40, depth: 58 },  // above fold end
  { pct: 55, depth: 41 },  // pricing cards
  { pct: 70, depth: 28 },
  { pct: 85, depth: 14 },
  { pct: 100, depth: 6 },
]

function HeatDot({ x, y, intensity, label }) {
  const size = 40 + intensity * 60
  const opacity = 0.3 + intensity * 0.5
  const color = intensity > 0.7 ? '#ef4444' : intensity > 0.4 ? '#f97316' : '#eab308'

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}
    />
  )
}

export default function Heatmap() {
  const [mapType, setMapType] = useState('click')
  const [page, setPage] = useState('/pricing')

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Heatmap</h1>
        <p className="text-slate-500 text-sm mt-0.5">See where visitors click, move, and stop scrolling</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Map type */}
        <div className="flex items-center gap-1 bg-surface-card border border-surface-border rounded-lg p-1">
          {[
            { id: 'click', icon: MousePointer, label: 'Clicks' },
            { id: 'move', icon: MoveHorizontal, label: 'Move' },
            { id: 'scroll', icon: ArrowDownUp, label: 'Scroll' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setMapType(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all ${
                mapType === id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        {/* Page selector */}
        <select
          value={page}
          onChange={e => setPage(e.target.value)}
          className="bg-surface-card border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-brand-500"
        >
          {pages.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Legend */}
        <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block opacity-60" /> Low
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 inline-block opacity-80" /> Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> High
          </span>
        </div>
      </div>

      {/* Heatmap canvas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-surface-card border border-surface-border rounded-xl overflow-hidden">
          {/* Fake browser chrome */}
          <div className="border-b border-surface-border px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex-1 bg-surface border border-surface-border rounded px-3 py-0.5 text-xs text-slate-500 mx-4">
              mystore.com{page}
            </div>
          </div>

          {/* Heatmap area */}
          <div className="relative bg-surface/50" style={{ height: 520 }}>
            {mapType === 'scroll' ? (
              /* Scroll depth visualization */
              <div className="absolute inset-0 flex">
                {scrollData.map((d, i) => (
                  <div key={i} className="flex flex-col justify-end" style={{ width: `${100 / scrollData.length}%` }}>
                    <div
                      style={{
                        height: `${d.depth}%`,
                        background: `rgba(99,102,241,${d.depth / 150})`,
                        borderTop: '1px solid rgba(99,102,241,0.3)',
                      }}
                    />
                    <p className="text-[9px] text-slate-600 text-center py-1">{d.pct}%</p>
                  </div>
                ))}
                <div className="absolute inset-0 flex flex-col justify-around pointer-events-none px-4">
                  {['Hero section', 'Features', 'Pricing cards ← 58% drop-off', 'Social proof', 'CTA', 'Footer'].map((label, i) => (
                    <div key={i} className="border-t border-dashed border-surface-border/50 pt-1">
                      <p className="text-[10px] text-slate-600">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Fake page wireframe */}
                <div className="absolute inset-0 flex flex-col gap-4 p-6 pointer-events-none opacity-20">
                  <div className="h-8 bg-slate-600 rounded w-2/3 mx-auto" />
                  <div className="h-4 bg-slate-700 rounded w-1/2 mx-auto" />
                  <div className="h-10 bg-brand-600 rounded-lg w-40 mx-auto" />
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-700 rounded-lg" />)}
                  </div>
                  <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-slate-700 rounded w-1/2 mx-auto" />
                </div>

                {/* Heat dots */}
                {clickData.map((d, i) => (
                  <HeatDot key={i} x={d[0]} y={d[1]} intensity={d[2]} label={d[3]} />
                ))}

                {/* Tooltip labels for top hot spots */}
                {clickData.filter(d => d[2] > 0.5).map((d, i) => (
                  <div
                    key={i}
                    className="absolute text-[10px] bg-surface-card border border-surface-border rounded px-1.5 py-0.5 text-slate-300 pointer-events-none"
                    style={{ left: `${d[0]}%`, top: `${d[1] - 6}%`, transform: 'translate(-50%, -100%)' }}
                  >
                    {d[3]}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Stats panel */}
        <div className="space-y-3">
          <div className="bg-surface-card border border-surface-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={15} className="text-red-400" />
              <h3 className="text-sm font-semibold text-white">Top Interaction Zones</h3>
            </div>
            <div className="space-y-2.5">
              {clickData.sort((a, b) => b[2] - a[2]).slice(0, 5).map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 text-xs text-slate-600 font-mono">{i + 1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-slate-300">{d[3]}</span>
                      <span className="text-slate-500">{Math.round(d[2] * 100)}%</span>
                    </div>
                    <div className="h-1 bg-surface-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${d[2] * 100}%`,
                          background: d[2] > 0.7 ? '#ef4444' : d[2] > 0.4 ? '#f97316' : '#eab308',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Insights</h3>
            {[
              { label: 'Total clicks recorded', value: '14,820' },
              { label: 'Dead clicks', value: '2,341 (15.8%)' },
              { label: 'Rage click areas', value: '3 zones' },
              { label: 'Above-fold engagement', value: '91%' },
              { label: 'Below-fold engagement', value: '34%' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-xs border-b border-surface-border pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-200 font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-brand-600/10 border border-brand-500/20 rounded-xl p-4">
            <p className="text-xs text-brand-300 font-semibold mb-1">AI Observation</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              95% of clicks concentrate in the top 40% of the page. Visitors rarely scroll past pricing cards — consider moving your strongest CTA above the fold.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
