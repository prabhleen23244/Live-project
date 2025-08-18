import { AuthProvider, useAuth } from "./contexts/AuthContext"
import AuthForm from "./components/AuthForm"
import ERPSystem from "./components/ERPSystem"

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ERP System...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <ERPSystem /> : <AuthForm />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
