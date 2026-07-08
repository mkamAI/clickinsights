import { useState } from 'react'
import { DollarSign, TrendingDown, Zap, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react'

const exitPoints = [
  {
    page: '/pricing',
    label: 'Pricing Page',
    visitors: 4820,
    exitRate: 67,
    lostMRR: 14200,
    lostARR: 170400,
    effort: 'Quick win',
    effortColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    fix: 'Add a mid-tier plan between Pro ($49) and Enterprise ($299). The pricing jump causes anchor shock — 72% of exits happen within 8s of landing on this page.',
    expectedRecovery: 4260,
    recoveryPct: 30,
    severity: 'critical',
    trend: '+12% this week',
  },
  {
    page: '/checkout/step-2',
    label: 'Checkout Step 2',
    visitors: 2940,
    exitRate: 54,
    lostMRR: 11800,
    lostARR: 141600,
    effort: 'Quick win',
    effortColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    fix: `Remove the "Company VAT number" required field. It's blocking 68% of individual buyers. Move billing fields to after payment intent is captured.`,
    expectedRecovery: 4720,
    recoveryPct: 40,
    severity: 'critical',
    trend: '+8% this week',
  },
  {
    page: '/product/pro-plan',
    label: 'Pro Plan Page',
    visitors: 3110,
    exitRate: 45,
    lostMRR: 8900,
    lostARR: 106800,
    effort: 'Medium',
    effortColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    fix: 'Add social proof near the CTA — session data shows visitors scroll past the features list and immediately look below the fold for reviews before exiting.',
    expectedRecovery: 2670,
    recoveryPct: 30,
    severity: 'high',
    trend: '-3% this week',
  },
  {
    page: '/signup',
    label: 'Sign-up Form',
    visitors: 1870,
    exitRate: 38,
    lostMRR: 7100,
    lostARR: 85200,
    effort: 'Quick win',
    effortColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    fix: 'Reduce form from 7 fields to 3 (email + password only). Every additional field costs ~8% conversion. Current form is the #1 mobile drop-off point.',
    expectedRecovery: 2840,
    recoveryPct: 40,
    severity: 'high',
    trend: '+5% this week',
  },
  {
    page: '/',
    label: 'Homepage Hero',
    visitors: 6240,
    exitRate: 31,
    lostMRR: 5230,
    lostARR: 62760,
    effort: 'Major rebuild',
    effortColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    fix: 'Hero headline is too generic. Visitors from paid ads bounce because the message doesn\'t match ad copy. Personalize headline by traffic source.',
    expectedRecovery: 1569,
    recoveryPct: 30,
    severity: 'medium',
    trend: '-1% this week',
  },
]

const totalLostMRR = exitPoints.reduce((s, e) => s + e.lostMRR, 0)
const totalRecoverable = exitPoints.reduce((s, e) => s + e.expectedRecovery, 0)

export default function RevenueImpact() {
  const [expanded, setExpanded] = useState(null)
  const [roiConversion, setRoiConversion] = useState(30)

  const estimated = Math.round(totalLostMRR * (roiConversion / 100))

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Revenue Impact</h1>
        <p className="text-slate-500 text-sm mt-0.5">AI-calculated revenue leaks across your funnel</p>
      </div>

      {/* Banner */}
      <div className="relative bg-gradient-to-r from-red-900/40 to-red-800/20 border border-red-500/30 rounded-2xl p-6 overflow-hidden glow-red">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wider">Total MRR at Risk</p>
            <p className="text-4xl font-bold text-white">${totalLostMRR.toLocaleString()}</p>
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <TrendingDown size={13} /> +$3,200 vs last month
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wider">Projected ARR Loss</p>
            <p className="text-4xl font-bold text-white">${(totalLostMRR * 12).toLocaleString()}</p>
            <p className="text-slate-500 text-sm mt-1">if nothing changes</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wider">Quick-Win Recovery</p>
            <p className="text-4xl font-bold text-emerald-400">${totalRecoverable.toLocaleString()}/mo</p>
            <p className="text-slate-500 text-sm mt-1">from top 4 fixes (2 weeks)</p>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-brand-400" />
          <h2 className="text-sm font-semibold text-white">Recovery Simulator</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>If you recover this % of lost revenue</span>
              <span className="text-white font-semibold">{roiConversion}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={80}
              value={roiConversion}
              onChange={e => setRoiConversion(+e.target.value)}
              className="w-full accent-brand-500 h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>5%</span><span>80%</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-slate-500 mb-0.5">Monthly recovery</p>
            <p className="text-2xl font-bold text-emerald-400">${estimated.toLocaleString()}</p>
            <p className="text-xs text-slate-500">${(estimated * 12).toLocaleString()}/yr ARR</p>
          </div>
        </div>
      </div>

      {/* Exit points */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white px-1">Exit Points — AI Diagnosed</h2>
        {exitPoints.map((ep, i) => (
          <div
            key={i}
            className="bg-surface-card border border-surface-border rounded-xl overflow-hidden"
          >
            {/* Row */}
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-hover transition-colors text-left"
            >
              {/* Severity dot */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                ep.severity === 'critical' ? 'bg-red-500' :
                ep.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
              }`} />

              {/* Page */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{ep.label}</p>
                <p className="text-xs text-slate-500 font-mono">{ep.page}</p>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-8 text-sm">
                <div className="text-center">
                  <p className="text-white font-medium">{ep.visitors.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">visitors</p>
                </div>
                <div className="text-center">
                  <p className="text-red-400 font-bold">{ep.exitRate}%</p>
                  <p className="text-xs text-slate-500">exit rate</p>
                </div>
                <div className="text-center">
                  <p className="text-red-400 font-bold">${ep.lostMRR.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">lost/mo</p>
                </div>
                <div className="text-center">
                  <p className="text-emerald-400 font-bold">+${ep.expectedRecovery.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">recoverable</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${ep.effortColor}`}>
                  {ep.effort}
                </span>
              </div>

              <ChevronRight
                size={16}
                className={`text-slate-500 flex-shrink-0 transition-transform ${expanded === i ? 'rotate-90' : ''}`}
              />
            </button>

            {/* Expanded AI diagnosis */}
            {expanded === i && (
              <div className="border-t border-surface-border bg-surface/50 px-5 py-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap size={13} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-400 font-semibold mb-1 uppercase tracking-wider">AI Diagnosis</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{ep.fix}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-surface-card border border-surface-border rounded-lg px-3 py-2.5">
                    <p className="text-xs text-slate-500 mb-0.5">Exit trend</p>
                    <p className="text-sm font-semibold text-red-400">{ep.trend}</p>
                  </div>
                  <div className="bg-surface-card border border-surface-border rounded-lg px-3 py-2.5">
                    <p className="text-xs text-slate-500 mb-0.5">If fixed, recover</p>
                    <p className="text-sm font-semibold text-emerald-400">+${ep.expectedRecovery.toLocaleString()}/mo</p>
                  </div>
                  <div className="bg-surface-card border border-surface-border rounded-lg px-3 py-2.5">
                    <p className="text-xs text-slate-500 mb-0.5">ARR upside</p>
                    <p className="text-sm font-semibold text-white">${(ep.expectedRecovery * 12).toLocaleString()}</p>
                  </div>
                </div>

                <button className="mt-4 flex items-center gap-2 text-xs bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <CheckCircle2 size={13} /> Mark as fixed
                  <ArrowRight size={13} className="ml-1" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
