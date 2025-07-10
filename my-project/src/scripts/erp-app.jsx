import { AuthProvider, useAuth } from "../contexts/AuthContext"
import Login from "../components/Login"
import Dashboard from "../components/Dashboard"

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return isAuthenticated ? <Dashboard /> : <Login />
}

export default function ERPApp() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
