import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { TrendingDown, TrendingUp, Users, MousePointerClick, AlertTriangle, DollarSign, ArrowUpRight } from 'lucide-react'

const visitorData = [
  { day: 'Mon', visitors: 3240, conversions: 58 },
  { day: 'Tue', visitors: 2980, conversions: 52 },
  { day: 'Wed', visitors: 3810, conversions: 71 },
  { day: 'Thu', visitors: 4120, conversions: 63 },
  { day: 'Fri', visitors: 3650, conversions: 67 },
  { day: 'Sat', visitors: 2100, conversions: 34 },
  { day: 'Sun', visitors: 1890, conversions: 29 },
]

const exitData = [
  { page: 'Pricing', exitRate: 67 },
  { page: 'Checkout', exitRate: 54 },
  { page: 'Product', exitRate: 45 },
  { page: 'Sign-up', exitRate: 38 },
  { page: 'Landing', exitRate: 31 },
  { page: 'About', exitRate: 22 },
]

const topExits = [
  { page: '/pricing', visitors: 4820, exits: 3230, rate: 67, lost: 14200, trend: 'up', severity: 'critical' },
  { page: '/checkout/step-2', visitors: 2940, exits: 1587, rate: 54, lost: 11800, trend: 'up', severity: 'critical' },
  { page: '/product/pro-plan', visitors: 3110, exits: 1399, rate: 45, lost: 8900, trend: 'down', severity: 'high' },
  { page: '/signup', visitors: 1870, exits: 710, rate: 38, lost: 7100, trend: 'up', severity: 'high' },
  { page: '/', visitors: 6240, exits: 1934, rate: 31, lost: 5230, trend: 'down', severity: 'medium' },
]

const severityColors = {
  critical: 'text-red-600 bg-red-50 border-red-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
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
        {trend && (
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
    <div className="bg-surface-card border border-surface-border rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [range, setRange] = useState('7d')

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-400 text-sm mt-0.5">mystore.com · Last updated 2 min ago</p>
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

      {/* Metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Total Visitors" value="21,790" trend={8} color="brand" sub="vs last week" />
        <MetricCard icon={MousePointerClick} label="Conversion Rate" value="1.73%" trend={-3} color="yellow" sub="avg 2.0% for SaaS" />
        <MetricCard icon={AlertTriangle} label="Avg Exit Rate" value="48.6%" trend={5} color="red" sub="across all pages" />
        <MetricCard icon={DollarSign} label="Revenue at Risk" value="$47,230" trend={12} color="red" sub="est. monthly loss" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Visitor trend */}
        <div className="xl:col-span-2 bg-surface-card border border-surface-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900">Visitor Trend</h2>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-500 inline-block"/>Visitors</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>Conversions</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={visitorData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} fill="url(#gVisitors)" name="Visitors" />
              <Area type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} fill="url(#gConversions)" name="Conversions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Exit rates bar */}
        <div className="bg-surface-card border border-surface-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">Exit Rate by Page</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={exitData} layout="vertical" margin={{ top: 0, right: 5, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="page" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="exitRate" name="Exit %" fill="#ef4444" radius={[0, 4, 4, 0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
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
                {['Page', 'Visitors', 'Exits', 'Exit Rate', 'Est. Loss/mo', 'Trend', 'Severity'].map(h => (
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
                  <td className="px-5 py-3.5 text-sm font-semibold text-red-400">${row.lost.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    {row.trend === 'up'
                      ? <TrendingUp size={15} className="text-red-400" />
                      : <TrendingDown size={15} className="text-emerald-400" />}
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
    </div>
  )
}
