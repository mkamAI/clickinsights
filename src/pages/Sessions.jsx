import { useState, useEffect } from 'react'
import { Monitor, Smartphone, Globe, Clock, Loader2, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useSite } from '../context/SiteContext'

function deviceIcon(device) {
  if (!device) return <Monitor size={14} />
  if (/mobile|android|iphone/i.test(device)) return <Smartphone size={14} />
  return <Monitor size={14} />
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function fmtDuration(ms) {
  if (!ms || ms < 1000) return '< 1s'
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

function EmptyState({ noSite }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Globe size={32} className="text-gray-300 mb-4" />
      <p className="text-gray-500 text-sm">
        {noSite ? 'Select a site to view sessions.' : 'No sessions yet. Install the tracker and visit your site.'}
      </p>
    </div>
  )
}

export default function Sessions() {
  const { currentSite } = useSite()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!currentSite) { setLoading(false); return }
    fetchSessions()
  }, [currentSite])

  async function fetchSessions() {
    setLoading(true)
    const since = new Date()
    since.setDate(since.getDate() - 7)

    const { data, error } = await supabase
      .from('events')
      .select('session_id, type, url, occurred_at, device, time_on_page, rage_click')
      .eq('site_id', currentSite.id)
      .gte('occurred_at', since.toISOString())
      .order('occurred_at', { ascending: true })

    if (!error && data) {
      const map = {}
      data.forEach(e => {
        if (!map[e.session_id]) {
          map[e.session_id] = {
            id: e.session_id,
            device: e.device || 'Unknown',
            pages: new Set(),
            exitPage: null,
            lastSeen: e.occurred_at,
            duration: 0,
            rageClicks: 0,
          }
        }
        const s = map[e.session_id]
        if (e.url) { try { s.pages.add(new URL(e.url).pathname) } catch { s.pages.add(e.url) } }
        if (e.type === 'exit' && e.url) { try { s.exitPage = new URL(e.url).pathname } catch { s.exitPage = e.url } }
        if (new Date(e.occurred_at) > new Date(s.lastSeen)) s.lastSeen = e.occurred_at
        if (e.time_on_page) s.duration += e.time_on_page
        if (e.rage_click) s.rageClicks++
      })

      setSessions(
        Object.values(map)
          .sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen))
          .map(s => ({ ...s, pageCount: s.pages.size }))
      )
    }
    setLoading(false)
  }

  const filtered = sessions.filter(s =>
    !search ||
    s.id.includes(search) ||
    (s.exitPage || '').includes(search) ||
    (s.device || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-400 text-sm mt-0.5">{currentSite?.domain} · last 7 days</p>
        </div>
        <input
          type="text"
          placeholder="Search sessions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 size={28} className="text-blue-500 animate-spin" /></div>
      ) : !currentSite || sessions.length === 0 ? (
        <EmptyState noSite={!currentSite} />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Session', 'Device', 'Pages', 'Duration', 'Exit Page', 'Rage Clicks', 'Last Seen'].map(h => (
                  <th key={h} className="text-left text-xs text-gray-400 font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{s.id.slice(0, 8)}…</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs text-gray-600">
                      {deviceIcon(s.device)}{s.device.split(' ')[0]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{s.pageCount}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><Clock size={11} />{fmtDuration(s.duration)}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{s.exitPage || '—'}</td>
                  <td className="px-5 py-3.5">
                    {s.rageClicks > 0
                      ? <span className="flex items-center gap-1 text-xs text-red-500 font-medium"><Zap size={11} />{s.rageClicks}</span>
                      : <span className="text-xs text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{timeAgo(s.lastSeen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">No sessions match your search.</p>
          )}
        </div>
      )}
    </div>
  )
}
