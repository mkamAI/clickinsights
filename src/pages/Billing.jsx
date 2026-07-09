import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { CheckCircle2, Zap, Building2, Sparkles, ArrowRight } from 'lucide-react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    desc: 'Get started with basic analytics',
    color: 'border-surface-border',
    features: [
      '1 website',
      '5,000 sessions/mo',
      'Heatmaps & session recordings',
      '7-day data retention',
      'Basic exit analysis',
    ],
    cta: 'Current plan',
    disabled: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 59,
    desc: 'Everything you need to fix revenue leaks',
    color: 'border-blue-500',
    badge: 'Most popular',
    features: [
      '5 websites',
      'Unlimited sessions',
      'AI exit diagnosis',
      'Revenue Impact dashboard',
      '90-day data retention',
      'Funnel analysis',
      'Slack & email alerts',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 149,
    desc: 'For teams scaling to serious revenue',
    color: 'border-purple-500',
    features: [
      'Unlimited websites',
      'Unlimited sessions',
      'Everything in Pro',
      '1-year data retention',
      'Team members (5 seats)',
      'CRM integrations',
      'Custom AI training',
      'Dedicated account manager',
    ],
    cta: 'Upgrade to Business',
  },
]

export default function Billing() {
  const { user } = useAuth()
  const [billing, setBilling] = useState('monthly')
  const [loading, setLoading] = useState(null)
  const [success, setSuccess] = useState(new URLSearchParams(window.location.search).get('success'))

  async function handleUpgrade(planId) {
    setLoading(planId)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          userId: user.id,
          email: user.email,
        }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  const discount = billing === 'annual' ? 0.75 : 1

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Billing & Plans</h1>
        <p className="text-gray-400 text-sm mt-0.5">Upgrade to unlock AI diagnosis, revenue tracking, and unlimited sessions</p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
          <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-emerald-300">Payment successful — your plan has been upgraded!</p>
        </div>
      )}

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm ${billing === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
        <button
          onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
          className={`w-12 h-6 rounded-full transition-colors relative ${billing === 'annual' ? 'bg-blue-600' : 'bg-surface-border'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${billing === 'annual' ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
        <span className={`text-sm ${billing === 'annual' ? 'text-gray-900' : 'text-gray-400'}`}>
          Annual <span className="text-emerald-400 font-medium">Save 25%</span>
        </span>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-surface-card border-2 ${plan.color} rounded-2xl p-6 flex flex-col ${
              plan.highlight ? 'glow-brand' : ''
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                {plan.badge}
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                {plan.id === 'free' && <Sparkles size={15} className="text-gray-500" />}
                {plan.id === 'pro' && <Zap size={15} className="text-blue-600" />}
                {plan.id === 'business' && <Building2 size={15} className="text-purple-400" />}
                <h3 className="text-sm font-semibold text-gray-900">{plan.name}</h3>
              </div>
              <div className="flex items-end gap-1 mt-3">
                <span className="text-3xl font-bold text-gray-900">
                  {plan.price === 0 ? 'Free' : `$${Math.round(plan.price * discount)}`}
                </span>
                {plan.price > 0 && <span className="text-gray-400 text-sm mb-1">/mo</span>}
              </div>
              {plan.price > 0 && billing === 'annual' && (
                <p className="text-xs text-gray-400 mt-0.5">billed ${Math.round(plan.price * discount * 12)}/yr</p>
              )}
              <p className="text-xs text-gray-400 mt-2">{plan.desc}</p>
            </div>

            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => !plan.disabled && handleUpgrade(plan.id)}
              disabled={plan.disabled || loading === plan.id}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                plan.disabled
                  ? 'bg-surface-border text-gray-400 cursor-default'
                  : plan.highlight
                  ? 'bg-blue-600 hover:bg-blue-500 text-gray-900'
                  : 'bg-surface-hover border border-surface-border text-gray-700 hover:border-blue-500 hover:text-gray-900'
              }`}
            >
              {loading === plan.id
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>
                    {plan.cta}
                    {!plan.disabled && <ArrowRight size={14} />}
                  </>}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Common questions</h3>
        {[
          { q: 'Can I cancel anytime?', a: 'Yes — cancel from your billing portal any time. No lock-in.' },
          { q: 'What counts as a session?', a: 'One visitor visiting your site, regardless of how many pages they view.' },
          { q: 'Do you offer a trial?', a: 'The Free plan is your trial — use it as long as you need before upgrading.' },
          { q: 'Can I switch plans?', a: 'Yes, upgrade or downgrade any time. Changes take effect immediately.' },
        ].map(({ q, a }) => (
          <div key={q} className="border-b border-surface-border pb-3 last:border-0 last:pb-0">
            <p className="text-sm font-medium text-gray-700 mb-0.5">{q}</p>
            <p className="text-xs text-gray-400">{a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
