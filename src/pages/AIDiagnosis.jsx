import { useState } from 'react'
import { Brain, Zap, CheckCircle2, Circle, AlertTriangle, TrendingUp, ChevronDown, Sparkles } from 'lucide-react'

const diagnoses = [
  {
    page: '/pricing',
    label: 'Pricing Page',
    severity: 'critical',
    confidence: 94,
    rootCause: 'Price anchor shock — no intermediate tier between $49 and $299',
    detail: 'Session analysis of 4,820 visitors shows 72% exit within 8 seconds of viewing the pricing table. Eye-tracking patterns show visitors compare the two plans, find no middle ground, and leave without engaging with either CTA. This is a classic high-low anchoring failure.',
    fixes: [
      { label: 'Add $99/mo "Growth" tier between Pro and Enterprise', effort: 'Medium', impact: 'High', days: 3 },
      { label: 'Add "Most Popular" badge to Pro plan to reduce cognitive load', effort: 'Quick', impact: 'Medium', days: 0.5 },
      { label: 'Display monthly vs annual toggle prominently — annual saves 33%', effort: 'Quick', impact: 'Medium', days: 1 },
    ],
    patterns: ['Exit within 8s: 72%', 'Mobile exits: 81%', 'Return visits before exit: 2.4x'],
  },
  {
    page: '/checkout/step-2',
    label: 'Checkout Step 2',
    severity: 'critical',
    confidence: 91,
    rootCause: 'Required "Company VAT number" field blocking individual buyers',
    detail: '68% of exits on this step happen at the VAT field. Session recordings show users pausing, attempting to fill the field, then abandoning. The field is required but 83% of buyers are individuals who do not have a VAT number. The form was built for B2B but the majority of traffic is B2C.',
    fixes: [
      { label: 'Make VAT field optional or move to post-purchase settings', effort: 'Quick', impact: 'High', days: 0.5 },
      { label: 'Reduce checkout from 4 steps to 2 (email → payment)', effort: 'Medium', impact: 'High', days: 5 },
      { label: 'Add trust signals (SSL badge, money-back guarantee) near submit', effort: 'Quick', impact: 'Medium', days: 1 },
    ],
    patterns: ['VAT field abandonment: 68%', 'Mobile checkout drop-off: 74%', 'Avg time on step before exit: 47s'],
  },
  {
    page: '/product/pro-plan',
    label: 'Pro Plan Page',
    severity: 'high',
    confidence: 87,
    rootCause: 'Missing social proof at decision point — visitors seek validation before converting',
    detail: 'Scroll maps show visitors reach 80% page depth (features list), then scroll back up to look for testimonials or reviews before exiting. The page has no social proof between the hero and the CTA. This is a trust gap — visitors are interested but not convinced.',
    fixes: [
      { label: 'Add 3 customer testimonials with real names + logos above the CTA', effort: 'Quick', impact: 'High', days: 1 },
      { label: 'Add a "X companies signed up this week" live counter', effort: 'Quick', impact: 'Medium', days: 2 },
      { label: 'Embed G2 or Capterra review widget above the fold', effort: 'Quick', impact: 'Medium', days: 1 },
    ],
    patterns: ['Scroll-back behavior: 61%', 'Time on page before exit: 3m 8s', 'Comparison with competitors: 34%'],
  },
  {
    page: '/signup',
    label: 'Sign-up Form',
    severity: 'high',
    confidence: 89,
    rootCause: '7-field form is the #1 mobile exit trigger — each extra field costs ~8% conversion',
    detail: 'The sign-up form collects: name, last name, email, password, company, role, and phone. Session data shows mobile users abandon after field 3 (email) at a 74% rate. The phone field generates the most rage clicks. Industry benchmark: forms with ≤3 fields convert 2.4x better on mobile.',
    fixes: [
      { label: 'Reduce to email + password only. Collect rest during onboarding', effort: 'Quick', impact: 'High', days: 1 },
      { label: 'Add Google/GitHub OAuth — removes form friction entirely', effort: 'Medium', impact: 'High', days: 4 },
      { label: 'Remove phone number field (lowest completion rate: 41%)', effort: 'Quick', impact: 'Medium', days: 0.5 },
    ],
    patterns: ['Phone field rage clicks: 312/week', 'Mobile abandon rate: 74%', 'Form completion time: 2m 18s avg'],
  },
]

const severityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', dot: 'bg-red-500' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', dot: 'bg-orange-500' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', dot: 'bg-yellow-500' },
}

const effortConfig = {
  Quick: 'text-emerald-400 bg-emerald-500/10',
  Medium: 'text-yellow-400 bg-yellow-500/10',
  Hard: 'text-red-400 bg-red-500/10',
}

const impactConfig = {
  High: 'text-blue-600',
  Medium: 'text-gray-500',
  Low: 'text-gray-400',
}

export default function AIDiagnosis() {
  const [expanded, setExpanded] = useState(0)
  const [fixed, setFixed] = useState(new Set())

  const toggleFix = (key) => {
    const next = new Set(fixed)
    next.has(key) ? next.delete(key) : next.add(key)
    setFixed(next)
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Brain size={20} className="text-blue-600" />
            AI Diagnosis
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Root cause analysis for every exit point — updated daily</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-blue-600/10 border border-blue-500/20 rounded-lg px-3 py-2">
          <Sparkles size={13} className="text-blue-600" />
          <span className="text-blue-500">4 issues diagnosed · Last run 42 min ago</span>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Critical issues', value: 2, color: 'text-red-400' },
          { label: 'High priority', value: 2, color: 'text-orange-400' },
          { label: 'Quick wins', value: 6, color: 'text-emerald-400' },
          { label: 'Fixes applied', value: fixed.size, color: 'text-blue-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-surface-card border border-surface-border rounded-xl px-4 py-3">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Diagnoses */}
      <div className="space-y-3">
        {diagnoses.map((d, i) => {
          const cfg = severityConfig[d.severity]
          const isOpen = expanded === i

          return (
            <div key={i} className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
              {/* Header row */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-hover transition-colors text-left"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{d.label}</p>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${cfg.bg} ${cfg.color}`}>
                      {d.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{d.rootCause}</p>
                </div>

                <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">AI Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-surface-border rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${d.confidence}%` }} />
                      </div>
                      <span className="text-xs text-blue-600 font-medium">{d.confidence}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Fixes</p>
                    <p className="text-sm font-medium text-gray-900">{d.fixes.length} suggested</p>
                  </div>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-surface-border">
                  {/* Detail */}
                  <div className="px-5 py-4 bg-surface/30">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Brain size={13} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">Root Cause Analysis</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{d.detail}</p>
                      </div>
                    </div>

                    {/* Patterns */}
                    <div className="flex items-center gap-3 flex-wrap ml-10">
                      {d.patterns.map((p, pi) => (
                        <span key={pi} className="text-xs text-gray-400 bg-surface border border-surface-border rounded px-2 py-1 flex items-center gap-1">
                          <TrendingUp size={10} className="text-gray-400" /> {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Fixes */}
                  <div className="px-5 py-4 border-t border-surface-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={14} className="text-blue-600" />
                      <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Suggested Fixes</p>
                    </div>
                    <div className="space-y-2">
                      {d.fixes.map((fix, fi) => {
                        const key = `${i}-${fi}`
                        const isDone = fixed.has(key)
                        return (
                          <div
                            key={fi}
                            onClick={() => toggleFix(key)}
                            className={`flex items-start gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                              isDone
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-surface border-surface-border hover:bg-surface-hover'
                            }`}
                          >
                            {isDone
                              ? <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                              : <Circle size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />}
                            <div className="flex-1">
                              <p className={`text-sm ${isDone ? 'line-through text-gray-400' : 'text-slate-200'}`}>
                                {fix.label}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${effortConfig[fix.effort]}`}>
                                  {fix.effort}
                                </span>
                                <span className={`text-xs font-medium ${impactConfig[fix.impact]}`}>
                                  {fix.impact} impact
                                </span>
                                <span className="text-xs text-gray-400">
                                  ~{fix.days < 1 ? `${fix.days * 8}h` : `${fix.days}d`}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
