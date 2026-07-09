import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const { error: err } = tab === 'login'
      ? await signIn(email, password)
      : await signUp(email, password)

    setLoading(false)
    if (err) {
      setError(err.message)
    } else if (tab === 'signup') {
      setSuccess('Check your email to confirm your account.')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mb-4 glow-brand">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ClickInsights<span className=".AI</span> is fine, keep as brand-400">.AI</span></h1>
          <p className="text-gray-400 text-sm mt-1">Know exactly why visitors leave</p>
        </div>

        {/* Card */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            {['login', 'signup'].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccess('') }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  tab === t
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full bg-white border border-surface-border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-white border border-surface-border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {tab === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {tab === 'login' && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Don't have an account?{' '}
              <button onClick={() => setTab('signup')} className=".AI</span> is fine, keep as brand-400 hover:text-brand-300">
                Sign up free
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}
