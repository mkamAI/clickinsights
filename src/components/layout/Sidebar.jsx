import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, DollarSign, Video, Flame,
  Brain, GitBranch, Settings, LogOut, Zap, CreditCard
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/',          icon: LayoutDashboard, label: 'Overview' },
  { to: '/revenue',   icon: DollarSign,      label: 'Revenue Impact' },
  { to: '/sessions',  icon: Video,           label: 'Sessions' },
  { to: '/heatmap',   icon: Flame,           label: 'Heatmap' },
  { to: '/diagnosis', icon: Brain,           label: 'AI Diagnosis' },
  { to: '/funnels',   icon: GitBranch,       label: 'Funnels' },
  { to: '/billing',   icon: CreditCard,      label: 'Billing' },
]

export default function Sidebar() {
  const { signOut, user } = useAuth()

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col bg-surface-card border-r border-surface-border min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight">ClickInsights</p>
            <p className="text-[10px] text-brand-400 font-medium">.AI</p>
          </div>
        </div>
      </div>

      {/* Site selector */}
      <div className="px-3 py-3 border-b border-surface-border">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-hover text-left hover:bg-surface-border transition-colors">
          <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs text-slate-300 truncate font-medium">mystore.com</span>
          <svg className="w-3 h-3 text-slate-500 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600/20 text-brand-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-brand-400' : ''} />
                {label}
                {label === 'Revenue Impact' && (
                  <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-semibold">LIVE</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-surface-border pt-3">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-surface-hover w-full transition-all">
          <Settings size={16} />
          Settings
        </button>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>
        <div className="px-3 pt-2">
          <p className="text-[11px] text-slate-600 truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  )
}
