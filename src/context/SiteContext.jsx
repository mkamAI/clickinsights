import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const { user } = useAuth()
  const [sites, setSites] = useState([])
  const [currentSite, setCurrentSite] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setSites([]); setCurrentSite(null); setLoading(false); return }
    loadSites()
  }, [user])

  async function loadSites() {
    setLoading(true)
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setSites(data)
      // Restore last selected site from localStorage
      const saved = localStorage.getItem('ci_current_site')
      const found = saved ? data.find(s => s.id === saved) : null
      setCurrentSite(found || data[0] || null)
    }
    setLoading(false)
  }

  async function addSite(name, domain) {
    const { data, error } = await supabase
      .from('sites')
      .insert({ user_id: user.id, name, domain })
      .select()
      .single()

    if (error) throw error
    setSites(prev => [...prev, data])
    setCurrentSite(data)
    localStorage.setItem('ci_current_site', data.id)
    return data
  }

  function selectSite(site) {
    setCurrentSite(site)
    localStorage.setItem('ci_current_site', site.id)
  }

  return (
    <SiteContext.Provider value={{ sites, currentSite, loading, addSite, selectSite, reload: loadSites }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
