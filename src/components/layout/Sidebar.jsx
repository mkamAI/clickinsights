import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, DollarSign, Video, Flame,
  Brain, GitBranch, Settings, LogOut, Zap, CreditCard, Plus, ChevronDown
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSite } from '../../context/SiteContext'

const nav = [
  { to: '/app',          icon: LayoutDashboard, label: 'Overview' },
  { to: '/app/revenue',  icon: DollarSign,      label: 'Revenue Impact' },
  { to: '/app/sessions', icon: Video,           label: 'Sessions' },
  { to: '/app/heatmap',  icon: Flame,           label: 'Heatmap' },
  { to: '/app/diagnosis',icon: Brain,           label: 'AI Diagnosis' },
  { to: '/app/funnels',  icon: GitBranch,       label: 'Funnels' },
  { to: '/app/billing',  icon: CreditCard,      label: 'Billing' },
]

export default function Sidebar() {
  const { signOut, user } = useAuth()
  const { sites, currentSite, selectSite } = useSite()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col bg-surface-card border-r border-surface-border min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 tracking-tight">ClickInsights</p>
            <p className="text-[10px] text-brand-400 font-medium">.AI</p>
          </div>
        </div>
      </div>

      {/* Site selector */}
      <div className="px-3 py-3 border-b border-surface-border relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-hover text-left hover:bg-surface-border transition-colors"
        >
          <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs text-gray-700 truncate font-medium">
            {currentSite ? currentSite.domain : 'No site selected'}
          </span>
          <ChevronDown size={12} className="text-gray-400 ml-auto flex-shrink-0" />
        </button>

        {open && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 overflow-hidden">
            {sites.map(site => (
              <button
                key={site.id}
                onClick={() => { selectSite(site); setOpen(false) }}
                className={`w-full text-left px-3 py-2.5 text-xs hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                  currentSite?.id === site.id ? 'text-blue-700 bg-blue-50 font-medium' : 'text-gray-700'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                {site.domain}
              </button>
            ))}
            <NavLink
              to="/app/settings"
              onClick={() => setOpen(false)}
              className="w-full text-left px-3 py-2.5 text-xs text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2 border-t border-gray-100"
            >
              <Plus size={12} /> Add new site
            </NavLink>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/app'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-surface-hover'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-blue-600' : ''} />
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
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full transition-all ${
              isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:text-gray-900 hover:bg-surface-hover'
            }`
          }
        >
          <Settings size={16} />
          Settings
        </NavLink>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 w-full transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>
        <div className="px-3 pt-2">
          <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  )
}
