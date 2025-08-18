import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { ERPProvider } from "../contexts/ERPContext"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import HRModule from "./HRModule"
import InventoryModule from "./InventoryModule"
import SalesModule from "./SalesModule"
import FinanceModule from "./FinanceModule"

function ERPContent() {
  const { user } = useAuth()
  const [activeModule, setActiveModule] = useState("dashboard")

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />
      case "hr":
        return <HRModule />
      case "inventory":
        return <InventoryModule />
      case "sales":
        return <SalesModule />
      case "finance":
        return <FinanceModule />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 overflow-auto">
        <div className="min-h-full">
          {renderModule()}
        </div>
      </div>
    </div>
  )
}

export default function ERPSystem() {
  return (
    <ERPProvider>
      <ERPContent />
    </ERPProvider>
  )
}
