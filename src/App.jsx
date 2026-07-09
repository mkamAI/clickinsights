import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import RevenueImpact from './pages/RevenueImpact'
import Sessions from './pages/Sessions'
import Heatmap from './pages/Heatmap'
import AIDiagnosis from './pages/AIDiagnosis'
import Funnels from './pages/Funnels'
import Billing from './pages/Billing'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/auth" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<Landing />} />

      {/* Auth */}
      <Route path="/auth" element={user ? <Navigate to="/app" replace /> : <Auth />} />

      {/* Protected app */}
      <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="revenue" element={<RevenueImpact />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="heatmap" element={<Heatmap />} />
        <Route path="diagnosis" element={<AIDiagnosis />} />
        <Route path="funnels" element={<Funnels />} />
        <Route path="billing" element={<Billing />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
