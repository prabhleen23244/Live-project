import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function Sidebar({ activeModule, setActiveModule }) {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const modules = [
    { id: "dashboard", name: "Dashboard", icon: "📊", roles: ["admin", "manager", "staff"] },
    { id: "hr", name: "HR Management", icon: "👥", roles: ["admin", "manager"] },
    { id: "inventory", name: "Inventory", icon: "📦", roles: ["admin", "manager", "staff"] },
    { id: "sales", name: "Sales", icon: "💰", roles: ["admin", "manager", "staff"] },
    { id: "finance", name: "Finance", icon: "💳", roles: ["admin", "manager"] },
  ]

  const filteredModules = modules.filter((module) => module.roles.includes(user?.role))

  return (
    <div className={`bg-gray-900 text-white h-screen transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="text-xl font-bold">ERP System</h2>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-gray-800">
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      <nav className="mt-8">
        {filteredModules.map((module) => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-800 transition-colors ${
              activeModule === module.id ? "bg-blue-600" : ""
            }`}
          >
            <span className="text-xl">{module.icon}</span>
            {!isCollapsed && <span className="ml-3">{module.name}</span>}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          )}
          <button onClick={logout} className="p-2 rounded-lg hover:bg-gray-800" title="Logout">
            🚪
          </button>
        </div>
      </div>
    </div>
  )
}
