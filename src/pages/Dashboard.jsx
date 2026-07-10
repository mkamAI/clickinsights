import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { TrendingDown, TrendingUp, Users, MousePointerClick, AlertTriangle, DollarSign, ArrowUpRight, Plus, Loader2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSite } from '../context/SiteContext'

const severityColors = {
  critical: 'text-red-600 bg-red-50 border-red-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  low: 'text-gray-500 bg-gray-50 border-gray-200',
}

function getSeverity(rate) {
  if (rate >= 60) return 'critical'
  if (rate >= 45) return 'high'
  if (rate >= 30) return 'medium'
  return 'low'
}

function getRangeDates(range) {
  const now = new Date()
  const from = new Date(now)
  if (range === '24h') from.setHours(from.getHours() - 24)
  else if (range === '7d') from.setDate(from.getDate() - 7)
  else from.setDate(from.getDate() - 30)
  return { from: from.toISOString(), to: now.toISOString() }
}

function MetricCard({ icon: Icon, label, value, sub, color = 'brand', trend }) {
  const colors = {
    brand: 'from-blue-50 to-blue-50 border-blue-100',
    red: 'from-red-50 to-red-50 border-red-100',
    green: 'from-emerald-50 to-emerald-50 border-emerald-100',
    yellow: 'from-amber-50 to-amber-50 border-amber-100',
  }
  const iconColors = {
    brand: 'text-blue-600 bg-blue-100',
    red: 'text-red-600 bg-red-100',
    green: 'text-emerald-600 bg-emerald-100',
    yellow: 'text-amber-600 bg-amber-100',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4 flex flex-col gap-3`}>
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColors[color]}`}>
          <Icon size={18} />
        </div>
        {trend != null && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-md">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <Users size={24} className="text-blue-500" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">No data yet</h2>
      <p className="text-gray-400 text-sm max-w-sm mb-6">
        Install the tracking script on your site to start seeing visitor data here.
      </p>
      <NavLink
        to="/app/settings"
        className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={14} /> Get tracking code
      </NavLink>
    </div>
  )
}

function NoSiteState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Plus size={24} className="text-gray-400" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Add your first site</h2>
      <p className="text-gray-400 text-sm max-w-sm mb-6">
        Go to Settings to add a site and get your tracking script.
      </p>
      <NavLink
        to="/app/settings"
        className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={14} /> Add site
      </NavLink>
    </div>
  )
}

export default function Dashboard() {
  const [range, setRange] = useState('7d')
  const { currentSite } = useSite()
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!currentSite) { setLoading(false); return }
    fetchEvents()
  }, [currentSite, range])

  async function fetchEvents() {
    setLoading(true)
    const { from, to } = getRangeDates(range)
    const { data, error } = await supabase
      .from('events')
      .select('session_id, type, url, occurred_at, scroll_depth, time_on_page')
      .eq('site_id', currentSite.id)
      .gte('occurred_at', from)
      .lte('occurred_at', to)
      .order('occurred_at', { ascending: true })

    if (!error) setEvents(data || [])
    setLoading(false)
  }

  // ── Derived metrics ──────────────────────────────────────────────
  const pageviews = events.filter(e => e.type === 'pageview')
  const exits = events.filter(e => e.type === 'exit')
  const uniqueSessions = new Set(events.map(e => e.session_id)).size

  const avgExitRate = pageviews.length > 0
    ? Math.round((exits.length / pageviews.length) * 100)
    : 0

  // Visitor trend: group pageviews by day
  const dayMap = {}
  const safePath = (url) => {
    if (!url) return '/'
    try { return new URL(url).pathname } catch { return url.startsWith('/') ? url : '/' }
  }
  pageviews.forEach(e => {
    const day = new Date(e.occurred_at).toLocaleDateString('en-US', { weekday: 'short' })
    if (!dayMap[day]) dayMap[day] = { day, visitors: new Set(), pageviews: 0 }
    dayMap[day].visitors.add(e.session_id)
    dayMap[day].pageviews++
  })
  const visitorData = Object.values(dayMap).map(d => ({
    day: d.day,
    visitors: d.visitors.size,
    pageviews: d.pageviews,
  }))

  // Top exit pages
  const pageStats = {}
  pageviews.forEach(e => {
    const path = safePath(e.url)
    if (!pageStats[path]) pageStats[path] = { visitors: new Set(), pageviews: 0, exits: 0 }
    pageStats[path].visitors.add(e.session_id)
    pageStats[path].pageviews++
  })
  exits.forEach(e => {
    const path = safePath(e.url)
    if (!pageStats[path]) pageStats[path] = { visitors: new Set(), pageviews: 0, exits: 0 }
    pageStats[path].exits++
  })
  const topExits = Object.entries(pageStats)
    .map(([page, s]) => ({
      page,
      visitors: s.visitors.size,
      exits: s.exits,
      rate: s.pageviews > 0 ? Math.round((s.exits / s.pageviews) * 100) : 0,
      severity: getSeverity(s.pageviews > 0 ? Math.round((s.exits / s.pageviews) * 100) : 0),
    }))
    .sort((a, b) => b.exits - a.exits)
    .slice(0, 10)

  const exitChartData = topExits.slice(0, 6).map(p => ({
    page: p.page.length > 12 ? p.page.slice(0, 12) + '…' : p.page,
    exitRate: p.rate,
  }))

  const hasData = events.length > 0

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {currentSite ? `${currentSite.domain}` : 'No site selected'} · {loading ? 'Loading…' : `${events.length.toLocaleString()} events`}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-surface-card border border-surface-border rounded-lg p-1">
          {['24h', '7d', '30d'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                range === r ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="text-blue-500 animate-spin" />
        </div>
      )}

      {/* No site */}
      {!loading && !currentSite && <NoSiteState />}

      {/* No data yet */}
      {!loading && currentSite && !hasData && <EmptyState />}

      {/* Real data */}
      {!loading && currentSite && hasData && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard icon={Users} label="Total Visitors" value={uniqueSessions.toLocaleString()} color="brand" sub={`unique sessions`} />
            <MetricCard icon={MousePointerClick} label="Total Pageviews" value={pageviews.length.toLocaleString()} color="yellow" />
            <MetricCard icon={AlertTriangle} label="Avg Exit Rate" value={`${avgExitRate}%`} color={avgExitRate > 50 ? 'red' : 'yellow'} sub="across all pages" />
            <MetricCard icon={DollarSign} label="Exit Events" value={exits.length.toLocaleString()} color="red" sub="tracked exits" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Visitor trend */}
            <div className="xl:col-span-2 bg-surface-card border border-surface-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-gray-900">Visitor Trend</h2>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Visitors</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Pageviews</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={visitorData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gPageviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} fill="url(#gVisitors)" name="Visitors" />
                  <Area type="monotone" dataKey="pageviews" stroke="#10b981" strokeWidth={2} fill="url(#gPageviews)" name="Pageviews" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Exit rates bar */}
            <div className="bg-surface-card border border-surface-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-5">Exit Rate by Page</h2>
              {exitChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={exitChartData} layout="vertical" margin={{ top: 0, right: 5, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                    <YAxis type="category" dataKey="page" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="exitRate" name="Exit %" fill="#ef4444" radius={[0, 4, 4, 0]} fillOpacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-400 mt-8 text-center">No exit events yet</p>
              )}
            </div>
          </div>

          {/* Top exit pages */}
          <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
              <h2 className="text-sm font-semibold text-gray-900">Top Exit Pages</h2>
              <button className="text-xs text-blue-600 hover:text-blue-500 flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-border">
                    {['Page', 'Visitors', 'Exits', 'Exit Rate', 'Severity'].map(h => (
                      <th key={h} className="text-left text-xs text-gray-400 font-medium px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topExits.map((row, i) => (
                    <tr key={i} className="border-b border-surface-border/50 hover:bg-surface-hover transition-colors">
                      <td className="px-5 py-3.5 text-sm text-gray-700 font-mono text-xs">{row.page}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{row.visitors.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{row.exits.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${row.rate}%` }} />
                          </div>
                          <span className="text-sm text-gray-700">{row.rate}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded border font-medium ${severityColors[row.severity]}`}>
                          {row.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
