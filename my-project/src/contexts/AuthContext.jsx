import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("erpCurrentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Get all registered users from localStorage
  const getRegisteredUsers = () => {
    const users = localStorage.getItem("erpRegisteredUsers")
    return users ? JSON.parse(users) : []
  }

  // Save user to registered users list
  const saveUserToStorage = (userData) => {
    const existingUsers = getRegisteredUsers()
    const updatedUsers = [...existingUsers, userData]
    localStorage.setItem("erpRegisteredUsers", JSON.stringify(updatedUsers))
  }

  // Check if email already exists
  const emailExists = (email) => {
    const users = getRegisteredUsers()
    return users.some((user) => user.email.toLowerCase() === email.toLowerCase())
  }

  // Signup function
  const signup = async (userData) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if email already exists
      if (emailExists(userData.email)) {
        setIsLoading(false)
        return { success: false, message: "Email already exists!" }
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: userData.password,
        role: userData.role || "staff", // Default role
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      saveUserToStorage(newUser)

      setIsLoading(false)
      return { success: true, message: "Account created successfully!" }
    } catch (error) {
      console.error("Signup error:", error)
      setIsLoading(false)
      return { success: false, message: "Something went wrong!" }
    }
  }

  // Login function
  const login = async (email, password) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const users = getRegisteredUsers()
      const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (foundUser) {
        const userData = { ...foundUser }
        delete userData.password // Remove password from user object
        setUser(userData)
        localStorage.setItem("erpCurrentUser", JSON.stringify(userData))
        setIsLoading(false)
        return { success: true }
      }

      setIsLoading(false)
      return { success: false, message: "Invalid email or password!" }
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return { success: false, message: "Something went wrong!" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("erpCurrentUser")
  }

  const value = {
    user,
    signup,
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
