import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function Sidebar({ activeModule, setActiveModule }) {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] =  useState(false)

  const modules = [
    { 
      id: "dashboard", 
      name: "Dashboard", 
      icon: "📊", 
      roles: ["admin", "manager", "staff"],
      description: "Overview & Analytics"
    },
    { 
      id: "hr", 
      name: "HR Management", 
      icon: "👥", 
      roles: ["admin", "manager"],
      description: "Employee Management"
    },
    { 
      id: "inventory", 
      name: "Inventory", 
      icon: "📦", 
      roles: ["admin", "manager", "staff"],
      description: "Stock & Products"
    },
    { 
      id: "sales", 
      name: "Sales", 
      icon: "💰", 
      roles: ["admin", "manager", "staff"],
      description: "Orders & Revenue"
    },
    { 
      id: "finance", 
      name: "Finance", 
      icon: "💳", 
      roles: ["admin", "manager"],
      description: "Expenses & Reports"
    },
  ]

  const filteredModules = modules.filter((module) => module.roles.includes(user?.role))

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-gradient-to-r from-red-500 to-red-600"
      case "manager": return "bg-gradient-to-r from-blue-500 to-blue-600"
      case "staff": return "bg-gradient-to-r from-green-500 to-green-600"
      default: return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800"
      case "manager": return "bg-blue-100 text-blue-800"
      case "staff": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    // Add a small delay for better UX
    setTimeout(() => {
      logout()
      setIsLoggingOut(false)
      setShowLogoutModal(false)
    }, 1500)
  }

  return (
    <>
      <div className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-screen transition-all duration-300 ease-in-out shadow-2xl ${isCollapsed ? "w-20" : "w-72"} relative`}>
        {/* Header Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold">E</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ERP System
                  </h2>
                  <p className="text-xs text-gray-400">Enterprise Solution</p>
                </div>
              </div>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 group"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <span className={`text-lg transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}>
                {isCollapsed ? "→" : "←"}
              </span>
            </button>
          </div>
        </div>

        {/* Enhanced User Profile Section - Now Clickable */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={() => setShowProfileModal(true)}
            className={`w-full flex items-center ${isCollapsed ? "justify-center" : "space-x-3"} p-2 rounded-xl hover:bg-gray-700/50 transition-all duration-200 group`}
            title={isCollapsed ? "View Profile" : ""}
          >
            <div className={`${getRoleColor(user?.role)} w-12 h-12 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-200`}>
              <span className="text-lg font-bold">{user?.name?.charAt(0)}</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                  {user?.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user?.role)}`}>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
            {!isCollapsed && (
              <div className="text-gray-400 group-hover:text-white transition-colors">
                <span className="text-sm">👤</span>
              </div>
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {!isCollapsed && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                Navigation
              </p>
            </div>
          )}
          
          {filteredModules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center px-3 py-3 text-left rounded-xl transition-all duration-200 group relative overflow-hidden ${
                activeModule === module.id 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105" 
                  : "hover:bg-gray-700/50 hover:transform hover:scale-105"
              }`}
              title={isCollapsed ? module.name : ""}
            >
              {/* Active indicator */}
              {activeModule === module.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r"></div>
              )}
              
              <div className="flex items-center space-x-3 w-full">
                <div className={`text-2xl transition-transform duration-200 ${activeModule === module.id ? "scale-110" : "group-hover:scale-110"}`}>
                  {module.icon}
                </div>
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{module.name}</p>
                    <p className="text-xs text-gray-300 truncate">{module.description}</p>
                  </div>
                )}
                
                {!isCollapsed && activeModule === module.id && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 rounded-xl transition-all duration-200"></div>
            </button>
          ))}
        </nav>

        {/* Quick Stats Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-700">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Quick Stats
              </p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-blue-600/20 rounded-lg p-2">
                  <p className="text-lg font-bold text-blue-400">24</p>
                  <p className="text-xs text-gray-400">Products</p>
                </div>
                <div className="bg-green-600/20 rounded-lg p-2">
                  <p className="text-lg font-bold text-green-400">₹2.1M</p>
                  <p className="text-xs text-gray-400">Revenue</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Bottom Section with Better Logout */}
        <div className="p-4 border-t border-gray-700">
          {!isCollapsed && (
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">System Online</span>
              </div>
            </div>
          )}
          
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-2"}`}>
            {!isCollapsed && (
              <button 
                className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 group"
                title="Settings"
              >
                <span className="text-lg group-hover:rotate-45 transition-transform duration-200">⚙️</span>
                <span className="text-sm text-gray-300">Settings</span>
              </button>
            )}
            
            {/* Enhanced Logout Button */}
            <button 
              onClick={() => setShowLogoutModal(true)}
              className={`${isCollapsed ? 'w-full' : 'flex-1'} flex items-center justify-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 group shadow-lg hover:shadow-xl transform hover:scale-105`}
              title="Logout"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">🚪</span>
              {!isCollapsed && (
                <span className="text-sm font-medium text-white">Logout</span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsed tooltip */}
        {isCollapsed && (
          <div className="absolute left-full top-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
              ERP System
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🚪</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
                <p className="text-gray-600">
                  Are you sure you want to logout from your account?
                </p>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">{user?.name}</span> • {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {isLoggingOut ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging out...</span>
                    </div>
                  ) : (
                    "Yes, Logout"
                  )}
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Your session will be ended and you'll need to login again
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Profile Modal */}
      {showProfileModal && (
        <ProfileModal 
          user={user} 
          onClose={() => setShowProfileModal(false)}
          getRoleColor={getRoleColor}
          getRoleBadgeColor={getRoleBadgeColor}
        />
      )}
    </>
  )
}

// Separate Profile Modal Component
function ProfileModal({ user, onClose, getRoleColor, getRoleBadgeColor }) {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+91 98765 43210",
    department: "Technology",
    location: "Mumbai, India",
    bio: "Experienced professional working in ERP systems and business management.",
    joinDate: "January 15, 2023",
    lastLogin: "Today at 10:30 AM"
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const tabs = [
    { id: "profile", name: "Profile", icon: "👤" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "activity", name: "Activity", icon: "📊" },
    { id: "settings", name: "Settings", icon: "⚙️" }
  ]

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
      alert("✅ Profile updated successfully!")
    }, 1500)
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("❌ New passwords don't match!")
      return
    }
    if (passwordData.newPassword.length < 6) {
      alert("❌ Password must be at least 6 characters!")
      return
    }
    
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setShowPasswordChange(false)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      alert("✅ Password changed successfully!")
    }, 1500)
  }

  const activityData = [
    { action: "Logged in", time: "2 hours ago", icon: "🔑" },
    { action: "Updated inventory", time: "4 hours ago", icon: "📦" },
    { action: "Created new sale", time: "6 hours ago", icon: "💰" },
    { action: "Added employee", time: "1 day ago", icon: "👥" },
    { action: "Generated report", time: "2 days ago", icon: "📊" }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className={`${getRoleColor(user?.role)} text-white p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold">{user?.name?.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-white/80 capitalize">{user?.role} • ERP System</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? "Cancel" : "✏️ Edit Profile"}
                </button>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-2 rounded-lg text-sm font-medium ${getRoleBadgeColor(user?.role)}`}>
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">(Cannot be changed)</span>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              {/* Account Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                  <p className="text-gray-900">{profileData.joinDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                  <p className="text-gray-900">{profileData.lastLogin}</p>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "💾 Save Changes"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>
              
              {/* Password Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                  </div>

                  

                  <button
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🔑 Change Password
                  </button>
                </div>

                
            



                {showPasswordChange && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowPasswordChange(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePasswordChange}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    🔐 Enable 2FA
                  </button>
                </div>
              </div>

              {/* Login Sessions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Active Sessions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💻</span>
                      <div>
                        <p className="font-medium text-gray-900">Current Session</p>
                        <p className="text-sm text-gray-600">Chrome on Windows • Mumbai, India</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
              
              <div className="space-y-3">
                {activityData.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">47</p>
                  <p className="text-sm text-blue-800">Total Logins</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">23</p>
                  <p className="text-sm text-green-800">Actions Today</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">156</p>
                  <p className="text-sm text-purple-800">Total Actions</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Account Settings</h3>
              
              {/* Notification Settings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Stock alerts</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">System updates</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Privacy</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Profile visibility</span>
                    <select className="border border-gray-300 rounded px-3 py-1">
                      <option>Team only</option>
                      <option>Company</option>
                      <option>Public</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Activity tracking</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                <p className="text-sm text-red-700 mb-4">These actions cannot be undone</p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  🗑️ Delete Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Profile last updated: 2 days ago
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
