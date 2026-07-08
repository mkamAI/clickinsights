import { useState } from 'react'
import { GitBranch, Users, TrendingDown, AlertCircle, ChevronRight } from 'lucide-react'

const funnels = {
  'Signup Funnel': [
    { step: 'Landing Page Visit', visitors: 6240, pct: 100, dropPct: 0, lostRevenue: 0 },
    { step: 'Clicked "Get Started"', visitors: 2184, pct: 35, dropPct: 65, lostRevenue: 24480 },
    { step: 'Reached Sign-up Form', visitors: 1703, pct: 27.3, dropPct: 22, lostRevenue: 5710 },
    { step: 'Completed Form', visitors: 1022, pct: 16.4, dropPct: 40, lostRevenue: 7100 },
    { step: 'Confirmed Email', visitors: 716, pct: 11.5, dropPct: 30, lostRevenue: 4590 },
    { step: 'Activated Account', visitors: 501, pct: 8.0, dropPct: 30, lostRevenue: 3170 },
  ],
  'Checkout Funnel': [
    { step: 'Pricing Page', visitors: 4820, pct: 100, dropPct: 0, lostRevenue: 0 },
    { step: 'Clicked "Start Trial"', visitors: 1687, pct: 35, dropPct: 65, lostRevenue: 20230 },
    { step: 'Checkout Step 1 (Email)', visitors: 1350, pct: 28, dropPct: 20, lostRevenue: 4720 },
    { step: 'Checkout Step 2 (Billing)', visitors: 621, pct: 12.9, dropPct: 54, lostRevenue: 11800 },
    { step: 'Payment Submitted', visitors: 496, pct: 10.3, dropPct: 20, lostRevenue: 3310 },
    { step: 'Payment Confirmed', visitors: 412, pct: 8.5, dropPct: 17, lostRevenue: 2240 },
  ],
}

const totalRevenue = (steps) =>
  steps.reduce((s, step) => s + step.lostRevenue, 0)

const biggestDrop = (steps) =>
  steps.reduce((max, s) => s.dropPct > max.dropPct ? s : max, steps[0])

export default function Funnels() {
  const [activeFunnel, setActiveFunnel] = useState('Signup Funnel')
  const steps = funnels[activeFunnel]
  const maxVisitors = steps[0].visitors
  const totalLost = totalRevenue(steps)
  const worstStep = biggestDrop(steps.slice(1))

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <GitBranch size={20} className="text-brand-400" />
          Funnels
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Step-by-step drop-off analysis with revenue impact</p>
      </div>

      {/* Funnel selector */}
      <div className="flex items-center gap-2">
        {Object.keys(funnels).map(f => (
          <button
            key={f}
            onClick={() => setActiveFunnel(f)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
              activeFunnel === f
                ? 'bg-brand-600 text-white'
                : 'bg-surface-card border border-surface-border text-slate-400 hover:text-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Overall Conversion</p>
          <p className="text-2xl font-bold text-white">{steps[steps.length - 1].pct}%</p>
          <p className="text-xs text-slate-600 mt-0.5">{steps[steps.length - 1].visitors.toLocaleString()} of {maxVisitors.toLocaleString()} converted</p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Biggest Drop-off</p>
          <p className="text-2xl font-bold text-red-400">{worstStep.dropPct}%</p>
          <p className="text-xs text-slate-600 mt-0.5">at {worstStep.step}</p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Total Revenue Lost</p>
          <p className="text-2xl font-bold text-red-400">${totalLost.toLocaleString()}</p>
          <p className="text-xs text-slate-600 mt-0.5">estimated this month</p>
        </div>
      </div>

      {/* Funnel visualization */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-6">
        <div className="space-y-2">
          {steps.map((step, i) => {
            const width = (step.visitors / maxVisitors) * 100
            const isWorst = step.step === worstStep.step
            const isLast = i === steps.length - 1

            return (
              <div key={i}>
                {/* Drop-off indicator between steps */}
                {i > 0 && steps[i - 1].dropPct > 0 && (
                  <div className="flex items-center gap-3 py-1 ml-4">
                    <TrendingDown size={13} className="text-red-500 flex-shrink-0" />
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-red-400 font-semibold">-{steps[i - 1].dropPct}% dropped off</span>
                      {steps[i - 1].lostRevenue > 0 && (
                        <span className="text-slate-500">· ~${steps[i - 1].lostRevenue.toLocaleString()} lost/mo</span>
                      )}
                      {isWorst && (
                        <span className="flex items-center gap-1 text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded font-medium">
                          <AlertCircle size={10} /> Biggest leak
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Step bar */}
                <div className="group relative">
                  <div className="flex items-center gap-4 mb-1">
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: isLast ? '#10b981' : isWorst ? '#ef4444' : '#6366f1' }}>
                      <div className="w-2 h-2 rounded-full"
                        style={{ background: isLast ? '#10b981' : isWorst ? '#ef4444' : '#6366f1' }} />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm text-slate-300">{step.step}</span>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users size={11} /> {step.visitors.toLocaleString()}
                        </span>
                        <span className={`font-semibold ${isLast ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {step.pct}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="ml-9 h-8 bg-surface-border rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg transition-all duration-500 flex items-center"
                      style={{
                        width: `${width}%`,
                        background: isLast
                          ? 'linear-gradient(90deg, #059669, #10b981)'
                          : isWorst
                          ? 'linear-gradient(90deg, #b91c1c, #ef4444)'
                          : 'linear-gradient(90deg, #4338ca, #6366f1)',
                        opacity: 0.85,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center px-3">
                      <ChevronRight size={14} className="text-white/30" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step detail table */}
      <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-white">Step Breakdown</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border">
              {['Step', 'Visitors', 'Drop-off', 'Conversion', 'Revenue Lost/mo'].map(h => (
                <th key={h} className="text-left text-xs text-slate-500 font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {steps.map((step, i) => (
              <tr key={i} className="border-b border-surface-border/50 hover:bg-surface-hover transition-colors">
                <td className="px-5 py-3 text-sm text-slate-300">{step.step}</td>
                <td className="px-5 py-3 text-sm text-slate-300">{step.visitors.toLocaleString()}</td>
                <td className="px-5 py-3">
                  {step.dropPct > 0
                    ? <span className={`text-sm font-medium ${step.dropPct >= 50 ? 'text-red-400' : step.dropPct >= 30 ? 'text-orange-400' : 'text-yellow-400'}`}>
                        -{step.dropPct}%
                      </span>
                    : <span className="text-slate-600 text-sm">—</span>}
                </td>
                <td className="px-5 py-3 text-sm text-slate-300">{step.pct}%</td>
                <td className="px-5 py-3 text-sm">
                  {step.lostRevenue > 0
                    ? <span className="text-red-400 font-medium">${step.lostRevenue.toLocaleString()}</span>
                    : <span className="text-slate-600">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
