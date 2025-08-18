import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "staff",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { login, signup, isLoading } = useAuth()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (isLogin) {
      // Login Logic
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields")
        return
      }

      const result = await login(formData.email, formData.password)
      if (!result.success) {
        setError(result.message)
      }
    } else {
      // Signup Logic
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }

      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      if (result.success) {
        setSuccess(result.message)
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "staff",
        })
        // Switch to login form after successful signup
        setTimeout(() => {
          setIsLogin(true)
          setSuccess("")
        }, 2000)
      } else {
        setError(result.message)
      }
    }
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "staff",
    })
    setError("")
    setSuccess("")
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">E</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ERP System</h1>
            <p className="text-gray-600 mt-2">Enterprise Resource Planning</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <span className="mr-2">❌</span>
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <span className="mr-2">✅</span>
                {success}
              </div>
            )}

            {/* Name field - only for signup */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">👤</span>
                  </div>
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">📧</span>
                </div>
              </div>
            </div>

            {/* Password field with eye toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors group"
                  disabled={isLoading}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="text-gray-400 group-hover:text-gray-600 transition-colors text-lg">
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </button>
              </div>
              {formData.password && (
                <div className="mt-1 flex items-center space-x-1">
                  <div className={`h-1 w-full rounded ${
                    formData.password.length < 6 
                      ? "bg-red-200" 
                      : formData.password.length < 8 
                        ? "bg-yellow-200" 
                        : "bg-green-200"
                  }`}>
                    <div className={`h-1 rounded transition-all duration-300 ${
                      formData.password.length < 6 
                        ? "bg-red-500 w-1/3" 
                        : formData.password.length < 8 
                          ? "bg-yellow-500 w-2/3" 
                          : "bg-green-500 w-full"
                    }`}></div>
                  </div>
                  <span className={`text-xs font-medium ${
                    formData.password.length < 6 
                      ? "text-red-500" 
                      : formData.password.length < 8 
                        ? "text-yellow-500" 
                        : "text-green-500"
                  }`}>
                    {formData.password.length < 6 
                      ? "Weak" 
                      : formData.password.length < 8 
                        ? "Good" 
                        : "Strong"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password - only for signup */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors group"
                    disabled={isLoading}
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <span className="text-gray-400 group-hover:text-gray-600 transition-colors text-lg">
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="mt-1 flex items-center space-x-2">
                    <span className={`text-xs font-medium ${
                      formData.password === formData.confirmPassword 
                        ? "text-green-500" 
                        : "text-red-500"
                    }`}>
                      {formData.password === formData.confirmPassword ? "✅ Passwords match" : "❌ Passwords don't match"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Role selection - only for signup */}
            {!isLogin && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 appearance-none transition-colors"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">👔</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  <span>{isLogin ? "🚀" : "✨"}</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleForm} className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                {isLogin ? "Sign up here" : "Login here"}
              </button>
            </p>
          </div>

          {/* Info about roles */}
          {!isLogin && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                <span className="mr-2">ℹ️</span>
                Role Information:
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p className="flex items-center">
                  <span className="mr-2">🔴</span>
                  <strong>Admin:</strong> Full access to all modules
                </p>
                <p className="flex items-center">
                  <span className="mr-2">🔵</span>
                  <strong>Manager:</strong> Access to HR, Inventory, Sales, Finance
                </p>
                <p className="flex items-center">
                  <span className="mr-2">🟢</span>
                  <strong>Staff:</strong> Access to Dashboard, Inventory, Sales
                </p>
              </div>
            </div>
          )}

          {/* Security Tips */}
          {!isLogin && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-1 flex items-center text-sm">
                <span className="mr-2">🔒</span>
                Password Security Tips:
              </h4>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• Use at least 8 characters</li>
                <li>• Include numbers and special characters</li>
                <li>• Don't use common passwords</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
