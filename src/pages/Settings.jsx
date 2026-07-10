import { useState } from 'react'
import { Plus, Copy, Check, Globe, Trash2, Code } from 'lucide-react'
import { useSite } from '../context/SiteContext'

function TrackerSnippet({ siteId }) {
  const [copied, setCopied] = useState(false)
  const snippet = `<script>
  (function() {
    var s = document.createElement('script');
    s.src = 'https://clickinsights.ai/tracker.js';
    s.setAttribute('data-site-id', '${siteId}');
    document.head.appendChild(s);
  })();
</script>`

  function copy() {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
          <Code size={12} /> Paste before &lt;/body&gt; on your site
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
        >
          {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
        {snippet}
      </pre>
    </div>
  )
}

export default function Settings() {
  const { sites, addSite, reload } = useSite()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [expandedSite, setExpandedSite] = useState(null)

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim() || !domain.trim()) return
    setSaving(true)
    setError('')
    try {
      const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
      const site = await addSite(name.trim(), cleanDomain)
      setExpandedSite(site.id)
      setName('')
      setDomain('')
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your tracked websites</p>
      </div>

      {/* Sites section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Your Sites</h2>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> Add Site
          </button>
        </div>

        {/* Add site form */}
        {showForm && (
          <form onSubmit={handleAdd} className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Site name (e.g. VectorVault)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Domain (e.g. vectorvaultai.com)"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={saving}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Adding…' : 'Add'}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </form>
        )}

        {/* Site list */}
        {sites.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <Globe size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No sites yet. Add your first site to start tracking.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sites.map(site => (
              <li key={site.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{site.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{site.domain}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedSite(expandedSite === site.id ? null : site.id)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 border border-blue-200 rounded-lg px-2.5 py-1.5 hover:bg-blue-50 transition-colors"
                    >
                      <Code size={12} /> Get tracking code
                    </button>
                  </div>
                </div>
                {expandedSite === site.id && (
                  <TrackerSnippet siteId={site.id} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Site ID info */}
      <p className="text-xs text-gray-400 mt-4">
        Each site gets a unique ID used by the tracker script to route events to your dashboard.
      </p>
    </div>
  )
}
