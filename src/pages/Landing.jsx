import { Link } from 'react-router-dom'
import {
  Zap, TrendingDown, MousePointerClick, Brain,
  DollarSign, ArrowRight, CheckCircle2, Play
} from 'lucide-react'

const features = [
  {
    icon: MousePointerClick,
    title: 'See where people click and scroll',
    desc: 'Heatmaps and session recordings show you exactly how visitors move through your pages — no guesswork.',
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    icon: TrendingDown,
    title: 'Find out where they leave',
    desc: 'Pinpoint the exact pages where visitors drop off, and see how much revenue each exit point is costing you.',
    color: '#ef4444',
    bg: '#fef2f2',
  },
  {
    icon: Brain,
    title: 'AI tells you what to fix',
    desc: 'Our AI diagnoses each exit point and gives you plain-English recommendations — no analytics expertise needed.',
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    icon: DollarSign,
    title: 'See the money you could recover',
    desc: 'The Revenue Impact dashboard shows how much fixing each issue is worth. Fix the highest-value problems first.',
    color: '#10b981',
    bg: '#ecfdf5',
  },
]

const problems = [
  'Visitors browse your site but never buy',
  "You have no idea what's stopping them",
  'Analytics tools show you numbers, not answers',
  'Hotjar and FullStory cost a fortune',
]

const plans = [
  {
    name: 'Free',
    price: 0,
    features: ['1 website', '5,000 sessions/mo', 'Heatmaps & recordings', '7-day data history'],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 59,
    features: ['5 websites', 'Unlimited sessions', 'AI exit diagnosis', 'Revenue Impact dashboard', '90-day history'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Business',
    price: 149,
    features: ['Unlimited websites', 'Everything in Pro', '1-year history', '5 team seats', 'CRM integrations'],
    cta: 'Get started',
    highlight: false,
  },
]

export default function Landing() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#fff', color: '#111827', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #e5e7eb', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>ClickInsights<span style={{ color: '#3b82f6' }}>.AI</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/auth" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>Sign in</Link>
            <Link to="/auth" style={{ fontSize: 14, background: '#2563eb', color: '#fff', padding: '8px 20px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 999, padding: '6px 16px', fontSize: 12, color: '#2563eb', fontWeight: 600, marginBottom: 32 }}>
          <Zap size={12} />
          AI-powered exit analytics — free to start
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 800, lineHeight: 1.1, color: '#111827', marginBottom: 24 }}>
          Find out why visitors leave<br />
          <span style={{ color: '#2563eb' }}>without buying</span>
        </h1>

        <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7 }}>
          ClickInsights shows you exactly where people drop off, how much revenue that's costing you,
          and what to fix — in plain English. No analytics expertise needed.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          <Link to="/auth" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            Start for free <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6b7280', fontSize: 14, textDecoration: 'none' }}>
            <Play size={14} /> See how it works
          </a>
        </div>
        <p style={{ fontSize: 12, color: '#9ca3af' }}>No credit card required · Free plan available · Setup in 2 minutes</p>
      </section>

      {/* Problem section */}
      <section style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Sound familiar?</h2>
            <p style={{ color: '#6b7280', marginBottom: 28, lineHeight: 1.7, fontSize: 15 }}>
              Most store owners watch their conversion rate sit at 1–2% and have no idea how to fix it.
              Analytics tools give you numbers. They don't give you answers.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {problems.map((p, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#374151' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#ef4444', fontSize: 11 }}>✗</span>
                  </div>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Mock dashboard card */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>Revenue Impact</p>
              <span style={{ fontSize: 11, background: '#fef2f2', color: '#ef4444', padding: '3px 10px', borderRadius: 999, fontWeight: 600 }}>$12,400/mo at risk</span>
            </div>
            {[
              { page: 'Product page', lost: '$5,200', fix: 'Add size guide' },
              { page: 'Checkout step 2', lost: '$4,100', fix: 'Remove forced sign-up' },
              { page: 'Shipping page', lost: '$3,100', fix: 'Show free shipping earlier' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{item.page}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>AI fix: {item.fix}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>{item.lost}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Everything you need to fix your conversion rate</h2>
          <p style={{ color: '#6b7280', fontSize: 16 }}>One tool. No complexity. Results in days, not months.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section style={{ background: '#eff6ff', borderTop: '1px solid #dbeafe', borderBottom: '1px solid #dbeafe', padding: '64px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Up and running in 2 minutes</h2>
          <p style={{ color: '#6b7280', marginBottom: 48, fontSize: 15 }}>Add one line of code to your site. That's it.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { step: '1', title: 'Sign up free', desc: 'Create your account in seconds. No credit card needed.' },
              { step: '2', title: 'Add one script tag', desc: 'Copy a single line of code and paste it into your site.' },
              { step: '3', title: 'See your data', desc: 'Watch sessions, heatmaps, and AI insights roll in automatically.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{step}</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Simple, honest pricing</h2>
          <p style={{ color: '#6b7280', fontSize: 16 }}>Half the price of Hotjar. More insights out of the box.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{ background: '#fff', border: `2px solid ${plan.highlight ? '#2563eb' : '#e5e7eb'}`, borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 999 }}>
                  Most popular
                </div>
              )}
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 20 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#111827' }}>{plan.price === 0 ? 'Free' : `$${plan.price}`}</span>
                {plan.price > 0 && <span style={{ fontSize: 14, color: '#9ca3af', marginBottom: 6 }}>/mo</span>}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                    <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                style={{
                  display: 'block', textAlign: 'center', padding: '10px 0', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  background: plan.highlight ? '#2563eb' : 'transparent',
                  color: plan.highlight ? '#fff' : '#374151',
                  border: plan.highlight ? 'none' : '1px solid #d1d5db',
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', borderTop: '1px solid #dbeafe', borderBottom: '1px solid #dbeafe', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Ready to stop losing customers?</h2>
        <p style={{ color: '#6b7280', marginBottom: 32, fontSize: 16 }}>Join store owners using ClickInsights to fix their conversion rate and recover lost revenue.</p>
        <Link to="/auth" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
          Get started free <ArrowRight size={16} />
        </Link>
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 16 }}>No credit card required · Cancel anytime</p>
      </section>

      {/* Footer */}
      <footer style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={12} color="#fff" />
          </div>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>ClickInsights.AI</span>
        </div>
        <p style={{ fontSize: 12, color: '#d1d5db', margin: 0 }}>© 2026 ClickInsights.AI · All rights reserved</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms'].map(t => (
            <a key={t} href="#" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>{t}</a>
          ))}
          <Link to="/auth" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </footer>

    </div>
  )
}
