import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  
  const mockUsers = [
    { id: 1, email: "admin@erp.com", password: "admin123", name: "Admin User", role: "admin" },
    { id: 2, email: "manager@erp.com", password: "manager123", name: "Manager User", role: "manager" },
    { id: 3, email: "staff@erp.com", password: "staff123", name: "Staff User", role: "staff" },
  ]

  useEffect(() => {
    const savedUser = localStorage.getItem("erpUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const foundUser = mockUsers.find((u) => u.email === email && u.password === password)
      if (foundUser) {
        const userData = { ...foundUser }
        delete userData.password
        setUser(userData)
        localStorage.setItem("erpUser", JSON.stringify(userData))
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("erpUser")
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
