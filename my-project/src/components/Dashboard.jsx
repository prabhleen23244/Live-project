"use client"

import { useState, useEffect } from "react"
import { useERP } from "../contexts/ERPContext"
import { useAuth } from "../contexts/AuthContext"

export default function Dashboard() {
  const { getDashboardStats, products, sales, employees, expenses, getLowStockProducts, getCriticalStockProducts, restockProduct, addProduct, addEmployee, addSale, addExpense } = useERP()
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showRestockModal, setShowRestockModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [restockQuantity, setRestockQuantity] = useState("")
  const [showStockDetailsModal, setShowStockDetailsModal] = useState(false)
  
  // Add these state variables after the existing useState declarations
  const [showQuickActionModal, setShowQuickActionModal] = useState(false)
  const [activeQuickAction, setActiveQuickAction] = useState(null)
  const [quickActionData, setQuickActionData] = useState({
    // Product data
    productName: "",
    productCategory: "",
    productStock: "",
    productPrice: "",
    productReorderLevel: "",
    // Employee data
    employeeName: "",
    employeeEmail: "",
    employeePosition: "",
    employeeSalary: "",
    // Sale data
    saleCustomer: "",
    saleProduct: "",
    saleQuantity: "",
    // Expense data
    expenseCategory: "",
    expenseAmount: "",
    expenseDescription: ""
  })
  const [isSaving, setIsSaving] = useState(false)

  const stats = getDashboardStats()
  const lowStockProducts = getLowStockProducts()
  const criticalStockProducts = getCriticalStockProducts()

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const statCards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: "👥",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: `${stats.activeEmployees} Active`,
      changeType: "info",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      change: `${stats.wellStockedProducts} Well Stocked`,
      changeType: "good",
    },
    {
      title: "Total Sales",
      value: `₹${stats.totalSales.toLocaleString()}`,
      icon: "💰",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      change: `${stats.completedSales} Completed`,
      changeType: "increase",
    },
    {
      title: "Total Expenses",
      value: `₹${stats.totalExpenses.toLocaleString()}`,
      icon: "💳",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      change: `${expenses.length} Records`,
      changeType: "info",
    },
    {
      title: "Net Profit",
      value: `₹${stats.profit.toLocaleString()}`,
      icon: "📈",
      color: stats.profit >= 0 ? "from-purple-500 to-purple-600" : "from-red-500 to-red-600",
      bgColor: stats.profit >= 0 ? "bg-purple-50" : "bg-red-50",
      textColor: stats.profit >= 0 ? "text-purple-600" : "text-red-600",
      change: stats.profit >= 0 ? "Profitable" : "Loss",
      changeType: stats.profit >= 0 ? "good" : "alert",
    },
    {
      title: "Stock Alerts",
      value: stats.lowStockProducts + stats.outOfStockProducts,
      icon: "⚠️",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      change: `${stats.outOfStockProducts} Out of Stock`,
      changeType: "alert",
    },
  ]

  const recentSales = sales.slice(-5).reverse()
  const recentExpenses = expenses.slice(-3).reverse()
  const topProducts = products.sort((a, b) => b.stock - a.stock).slice(0, 5)

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleRestock = (product) => {
    setSelectedProduct(product)
    setShowRestockModal(true)
  }

  const handleRestockSubmit = (e) => {
    e.preventDefault()
    if (selectedProduct && restockQuantity) {
      restockProduct(selectedProduct.id, Number.parseInt(restockQuantity))
      setShowRestockModal(false)
      setSelectedProduct(null)
      setRestockQuantity("")
      alert(`✅ Successfully restocked ${selectedProduct.name} with ${restockQuantity} units!`)
    }
  }

  // Add these functions before the return statement
  const handleQuickAction = (actionType) => {
    setActiveQuickAction(actionType)
    setShowQuickActionModal(true)
    // Reset form data
    setQuickActionData({
      productName: "",
      productCategory: "",
      productStock: "",
      productPrice: "",
      productReorderLevel: "",
      employeeName: "",
      employeeEmail: "",
      employeePosition: "",
      employeeSalary: "",
      saleCustomer: "",
      saleProduct: "",
      saleQuantity: "",
      expenseCategory: "",
      expenseAmount: "",
      expenseDescription: ""
    })
  }

  const handleQuickActionSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      switch (activeQuickAction) {
        case 'addProduct':
          if (!quickActionData.productName || !quickActionData.productCategory || !quickActionData.productStock || !quickActionData.productPrice || !quickActionData.productReorderLevel) {
            alert("❌ Please fill all product fields!")
            setIsSaving(false)
            return
          }
          addProduct({
            name: quickActionData.productName,
            category: quickActionData.productCategory,
            stock: parseInt(quickActionData.productStock),
            price: parseInt(quickActionData.productPrice),
            reorderLevel: parseInt(quickActionData.productReorderLevel)
          })
          alert("✅ Product added successfully!")
          break

        case 'addEmployee':
          if (!quickActionData.employeeName || !quickActionData.employeeEmail || !quickActionData.employeePosition || !quickActionData.employeeSalary) {
            alert("❌ Please fill all employee fields!")
            setIsSaving(false)
            return
          }
          addEmployee({
            name: quickActionData.employeeName,
            email: quickActionData.employeeEmail,
            position: quickActionData.employeePosition,
            salary: parseInt(quickActionData.employeeSalary)
          })
          alert("✅ Employee added successfully!")
          break

        case 'newSale':
          if (!quickActionData.saleCustomer || !quickActionData.saleProduct || !quickActionData.saleQuantity) {
            alert("❌ Please fill all sale fields!")
            setIsSaving(false)
            return
          }
          const selectedProduct = products.find(p => p.name === quickActionData.saleProduct)
          if (!selectedProduct) {
            alert("❌ Selected product not found!")
            setIsSaving(false)
            return
          }
          if (selectedProduct.stock < parseInt(quickActionData.saleQuantity)) {
            alert("❌ Insufficient stock!")
            setIsSaving(false)
            return
          }
          addSale({
            customerName: quickActionData.saleCustomer,
            productName: quickActionData.saleProduct,
            quantity: parseInt(quickActionData.saleQuantity),
            status: "Pending"
          })
          alert("✅ Sale created successfully!")
          break

        case 'addExpense':
          if (!quickActionData.expenseCategory || !quickActionData.expenseAmount || !quickActionData.expenseDescription) {
            alert("❌ Please fill all expense fields!")
            setIsSaving(false)
            return
          }
          addExpense({
            category: quickActionData.expenseCategory,
            amount: parseInt(quickActionData.expenseAmount),
            description: quickActionData.expenseDescription
          })
          alert("✅ Expense added successfully!")
          break

        default:
          alert("❌ Unknown action!")
      }

      setTimeout(() => {
        setIsSaving(false)
        setShowQuickActionModal(false)
        setActiveQuickAction(null)
      }, 1000)

    } catch (error) {
      console.error("Quick action error:", error)
      alert("❌ Something went wrong!")
      setIsSaving(false)
    }
  }

  const closeQuickActionModal = () => {
    setShowQuickActionModal(false)
    setActiveQuickAction(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Welcome back, <span className="font-medium text-blue-600">{user?.name}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-center sm:text-right">
                <div className="text-lg sm:text-xl font-bold text-gray-900">{formatTime(currentTime)}</div>
                <div className="text-xs sm:text-sm text-gray-500">{formatDate(currentTime)}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm text-gray-600">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Critical Stock Alert Banner */}
        {criticalStockProducts.length > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg text-white p-4 mb-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🚨</span>
                <div>
                  <h3 className="font-bold text-lg">CRITICAL STOCK ALERT!</h3>
                  <p className="text-red-100">{criticalStockProducts.length} products need immediate attention</p>
                </div>
              </div>
              <button 
                onClick={() => setShowStockDetailsModal(true)}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <span className="text-xl sm:text-2xl">{stat.icon}</span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stat.changeType === "increase" || stat.changeType === "good"
                        ? "bg-green-100 text-green-800"
                        : stat.changeType === "alert"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className={`text-xl sm:text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Enhanced Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Stock Alerts</h3>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                    {stats.outOfStockProducts} Out
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                    {stats.lowStockProducts} Low
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 max-h-80 overflow-y-auto">
              {lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        product.stock === 0 
                          ? "bg-red-50 border-red-500" 
                          : "bg-yellow-50 border-yellow-500"
                      } hover:shadow-md transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{product.name}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-xs sm:text-sm text-gray-600">
                              Stock: <span className="font-medium">{product.stock}</span> units
                            </p>
                            <p className="text-xs text-gray-500">
                              Reorder: {product.reorderLevel} units
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">₹{product.price.toLocaleString()}</p>
                        </div>
                        <div className="ml-4 flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${product.stockStatus.color} text-white`}>
                            {product.stockStatus.status}
                          </span>
                          <button
                            onClick={() => handleRestock(product)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Restock
                          </button>
                        </div>
                      </div>
                      {product.stock === 0 && (
                        <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800 font-medium">
                          🚨 URGENT: Product is completely out of stock!
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gray-500 text-sm sm:text-base">All products are well stocked!</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {recentSales.length} orders
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-6 max-h-80 overflow-y-auto">
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{sale.customerName}</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {sale.productName} × {sale.quantity}
                      </p>
                      <p className="text-xs text-gray-500">{sale.date}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">₹{sale.amount.toLocaleString()}</p>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          sale.status === "Completed" 
                            ? "bg-green-100 text-green-800" 
                            : sale.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {sale.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">By Stock</span>
              </div>
            </div>
            <div className="p-4 sm:p-6 max-h-80 overflow-y-auto">
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center flex-1">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{product.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{product.stock} units</p>
                      <p className="text-xs text-gray-500">₹{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Restock Modal */}
        {showRestockModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Restock Product</h2>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{selectedProduct.name}</p>
                <p className="text-sm text-gray-600">Current Stock: {selectedProduct.stock} units</p>
                <p className="text-sm text-gray-600">Reorder Level: {selectedProduct.reorderLevel} units</p>
              </div>
              <form onSubmit={handleRestockSubmit} className="space-y-4">
                <input
                  type="number"
                  placeholder="Quantity to add"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Restock
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRestockModal(false)
                      setSelectedProduct(null)
                      setRestockQuantity("")
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Expenses */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                  ₹{stats.totalExpenses.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{expense.category}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{expense.description}</p>
                      <p className="text-xs text-gray-500">{expense.date}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium text-red-600 text-sm sm:text-base">
                        ₹{expense.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                  <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Ready</span>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                {/* Add Product */}
                <button 
                  onClick={() => handleQuickAction('addProduct')}
                  className="group flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">📦</span>
                  <span className="font-semibold">Add Product</span>
                  <span className="text-xs text-gray-500 mt-1">Create new inventory item</span>
                </button>

                {/* Add Employee */}
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <button 
                    onClick={() => handleQuickAction('addEmployee')}
                    className="group flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
                  >
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">👥</span>
                    <span className="font-semibold">Add Employee</span>
                    <span className="text-xs text-gray-500 mt-1">Register new team member</span>
                  </button>
                )}

                {/* New Sale */}
                <button 
                  onClick={() => handleQuickAction('newSale')}
                  className="group flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">💰</span>
                  <span className="font-semibold">New Sale</span>
                  <span className="text-xs text-gray-500 mt-1">Create customer order</span>
                </button>

                {/* Add Expense */}
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <button 
                    onClick={() => handleQuickAction('addExpense')}
                    className="group flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
                  >
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">💳</span>
                    <span className="font-semibold">Add Expense</span>
                    <span className="text-xs text-gray-500 mt-1">Record business expense</span>
                  </button>
                )}

                {/* Quick Restock */}
                <button 
                  onClick={() => {
                    const lowStock = getLowStockProducts()
                    if (lowStock.length > 0) {
                      handleRestock(lowStock[0])
                    } else {
                      alert("✅ All products are well stocked!")
                    }
                  }}
                  className="group flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">🔄</span>
                  <span className="font-semibold">Quick Restock</span>
                  <span className="text-xs text-gray-500 mt-1">Restock low inventory</span>
                  {stats.lowStockProducts > 0 && (
                    <span className="mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                      {stats.lowStockProducts} items
                    </span>
                  )}
                </button>

                {/* View Reports */}
                <button 
                  onClick={() => {
                    alert("📊 Reports Module - Coming Soon!\n\nFeatures:\n• Sales Reports\n• Inventory Reports\n• Financial Reports\n• Employee Reports\n• Custom Analytics")
                  }}
                  className="group flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">📊</span>
                  <span className="font-semibold">View Reports</span>
                  <span className="text-xs text-gray-500 mt-1">Analytics & insights</span>
                </button>

                {/* Bulk Operations */}
                <button 
                  onClick={() => {
                    alert("⚡ Bulk Operations - Coming Soon!\n\nFeatures:\n• Bulk Product Import\n• Mass Price Updates\n• Batch Employee Actions\n• Multiple Sales Processing")
                  }}
                  className="group flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">⚡</span>
                  <span className="font-semibold">Bulk Operations</span>
                  <span className="text-xs text-gray-500 mt-1">Mass data operations</span>
                </button>

                {/* System Backup */}
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => {
                      const confirmBackup = window.confirm("🔄 Create System Backup?\n\nThis will create a backup of all your ERP data including:\n• Products & Inventory\n• Employees & HR Data\n• Sales & Financial Records\n\nProceed with backup?")
                      if (confirmBackup) {
                        alert("✅ System backup initiated!\n\nBackup will be completed in the background.\nYou'll receive an email notification when ready.")
                      }
                    }}
                    className="group flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105"
                  >
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">💾</span>
                    <span className="font-semibold">System Backup</span>
                    <span className="text-xs text-gray-500 mt-1">Backup all data</span>
                  </button>
                )}
              </div>

              {/* Quick Stats Row */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{stats.totalProducts}</p>
                    <p className="text-xs text-blue-800">Total Products</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{stats.activeEmployees}</p>
                    <p className="text-xs text-green-800">Active Staff</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-lg font-bold text-yellow-600">{stats.pendingSales}</p>
                    <p className="text-xs text-yellow-800">Pending Sales</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">
                      {stats.lowStockProducts + stats.outOfStockProducts}
                    </p>
                    <p className="text-xs text-purple-800">Stock Alerts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comprehensive Quick Action Modal */}
          {showQuickActionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className={`p-6 ${
                  activeQuickAction === 'addProduct' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  activeQuickAction === 'addEmployee' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  activeQuickAction === 'newSale' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                  activeQuickAction === 'addExpense' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  'bg-gradient-to-r from-gray-500 to-gray-600'
                } text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">
                        {activeQuickAction === 'addProduct' ? '📦' :
                         activeQuickAction === 'addEmployee' ? '👥' :
                         activeQuickAction === 'newSale' ? '💰' :
                         activeQuickAction === 'addExpense' ? '💳' : '⚡'}
                      </span>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {activeQuickAction === 'addProduct' ? 'Add New Product' :
                           activeQuickAction === 'addEmployee' ? 'Add New Employee' :
                           activeQuickAction === 'newSale' ? 'Create New Sale' :
                           activeQuickAction === 'addExpense' ? 'Add New Expense' : 'Quick Action'}
                        </h2>
                        <p className="text-white/80">
                          {activeQuickAction === 'addProduct' ? 'Add a new product to inventory' :
                           activeQuickAction === 'addEmployee' ? 'Register a new team member' :
                           activeQuickAction === 'newSale' ? 'Process a customer order' :
                           activeQuickAction === 'addExpense' ? 'Record a business expense' : 'Perform quick action'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeQuickActionModal}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <span className="text-2xl">✕</span>
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                  <form onSubmit={handleQuickActionSubmit} className="space-y-4">
                    {/* Add Product Form */}
                    {activeQuickAction === 'addProduct' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Product Name *
                            </label>
                            <input
                              type="text"
                              value={quickActionData.productName}
                              onChange={(e) => setQuickActionData({...quickActionData, productName: e.target.value})}
                              placeholder="Enter product name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category *
                            </label>
                            <input
                              type="text"
                              value={quickActionData.productCategory}
                              onChange={(e) => setQuickActionData({...quickActionData, productCategory: e.target.value})}
                              placeholder="e.g., Electronics, Furniture"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Initial Stock *
                            </label>
                            <input
                              type="number"
                              value={quickActionData.productStock}
                              onChange={(e) => setQuickActionData({...quickActionData, productStock: e.target.value})}
                              placeholder="0"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price (₹) *
                            </label>
                            <input
                              type="number"
                              value={quickActionData.productPrice}
                              onChange={(e) => setQuickActionData({...quickActionData, productPrice: e.target.value})}
                              placeholder="0"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Reorder Level *
                            </label>
                            <input
                              type="number"
                              value={quickActionData.productReorderLevel}
                              onChange={(e) => setQuickActionData({...quickActionData, productReorderLevel: e.target.value})}
                              placeholder="Minimum stock level for alerts"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Add Employee Form */}
                    {activeQuickAction === 'addEmployee' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={quickActionData.employeeName}
                              onChange={(e) => setQuickActionData({...quickActionData, employeeName: e.target.value})}
                              placeholder="Enter full name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              value={quickActionData.employeeEmail}
                              onChange={(e) => setQuickActionData({...quickActionData, employeeEmail: e.target.value})}
                              placeholder="employee@company.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Position *
                            </label>
                            <input
                              type="text"
                              value={quickActionData.employeePosition}
                              onChange={(e) => setQuickActionData({...quickActionData, employeePosition: e.target.value})}
                              placeholder="e.g., Software Developer"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Salary (₹) *
                            </label>
                            <input
                              type="number"
                              value={quickActionData.employeeSalary}
                              onChange={(e) => setQuickActionData({...quickActionData, employeeSalary: e.target.value})}
                              placeholder="Monthly salary"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* New Sale Form */}
                    {activeQuickAction === 'newSale' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Customer Name *
                            </label>
                            <input
                              type="text"
                              value={quickActionData.saleCustomer}
                              onChange={(e) => setQuickActionData({...quickActionData, saleCustomer: e.target.value})}
                              placeholder="Enter customer name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Product *
                            </label>
                            <select
                              value={quickActionData.saleProduct}
                              onChange={(e) => setQuickActionData({...quickActionData, saleProduct: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              required
                            >
                              <option value="">Select Product</option>
                              {products.filter(p => p.stock > 0).map((product) => (
                                <option key={product.id} value={product.name}>
                                  {product.name} (₹{product.price}) - {product.stock} available
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quantity *
                            </label>
                            <input
                              type="number"
                              value={quickActionData.saleQuantity}
                              onChange={(e) => setQuickActionData({...quickActionData, saleQuantity: e.target.value})}
                              placeholder="Enter quantity"
                              min="1"
                              max={products.find(p => p.name === quickActionData.saleProduct)?.stock || 999}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              required
                            />
                            {quickActionData.saleProduct && (
                              <p className="text-sm text-gray-600 mt-1">
                                Available stock: {products.find(p => p.name === quickActionData.saleProduct)?.stock || 0} units
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Add Expense Form */}
                    {activeQuickAction === 'addExpense' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category *
                            </label>
                            <input
                              type="text"
                              value={quickActionData.expenseCategory}
                              onChange={(e) => setQuickActionData({...quickActionData, expenseCategory: e.target.value})}
                              placeholder="e.g., Office Rent, Marketing"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Amount (₹) *
                            </label>
                            <input
                              type="number"
                              value={quickActionData.expenseAmount}
                              onChange={(e) => setQuickActionData({...quickActionData, expenseAmount: e.target.value})}
                              placeholder="Enter amount"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description *
                            </label>
                            <textarea
                              value={quickActionData.expenseDescription}
                              onChange={(e) => setQuickActionData({...quickActionData, expenseDescription: e.target.value})}
                              placeholder="Describe the expense..."
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={closeQuickActionModal}
                        disabled={isSaving}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-6 py-3 text-white rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none ${
                          activeQuickAction === 'addProduct' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500' :
                          activeQuickAction === 'addEmployee' ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-500' :
                          activeQuickAction === 'newSale' ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 focus:ring-yellow-500' :
                          activeQuickAction === 'addExpense' ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500' :
                          'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500'
                        }`}
                      >
                        {isSaving ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>
                              {activeQuickAction === 'addProduct' ? 'Adding Product...' :
                               activeQuickAction === 'addEmployee' ? 'Adding Employee...' :
                               activeQuickAction === 'newSale' ? 'Creating Sale...' :
                               activeQuickAction === 'addExpense' ? 'Adding Expense...' : 'Processing...'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>
                              {activeQuickAction === 'addProduct' ? '📦 Add Product' :
                               activeQuickAction === 'addEmployee' ? '👥 Add Employee' :
                               activeQuickAction === 'newSale' ? '💰 Create Sale' :
                               activeQuickAction === 'addExpense' ? '💳 Add Expense' : 'Submit'}
                            </span>
                          </div>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Comprehensive Stock Details Modal */}
          {showStockDetailsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">📊</span>
                      <div>
                        <h2 className="text-2xl font-bold">Stock Alert Details</h2>
                        <p className="text-red-100">Complete inventory status overview</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowStockDetailsModal(false)}
                      className="p-2 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      <span className="text-2xl">✕</span>
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-600 font-medium text-sm">Out of Stock</p>
                          <p className="text-2xl font-bold text-red-700">{stats.outOfStockProducts}</p>
                        </div>
                        <span className="text-2xl">🚨</span>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-yellow-600 font-medium text-sm">Low Stock</p>
                          <p className="text-2xl font-bold text-yellow-700">{stats.lowStockProducts}</p>
                        </div>
                        <span className="text-2xl">⚠️</span>
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-600 font-medium text-sm">Critical</p>
                          <p className="text-2xl font-bold text-orange-700">{stats.criticalStockProducts}</p>
                        </div>
                        <span className="text-2xl">🔥</span>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 font-medium text-sm">Well Stocked</p>
                          <p className="text-2xl font-bold text-green-700">{stats.wellStockedProducts}</p>
                        </div>
                        <span className="text-2xl">✅</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Product List */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Products Requiring Attention</h3>
                    
                    {lowStockProducts.length > 0 ? (
                      <div className="space-y-3">
                        {lowStockProducts.map((product) => (
                          <div
                            key={product.id}
                            className={`border rounded-xl p-4 transition-all hover:shadow-lg ${
                              product.stock === 0 
                                ? "border-red-300 bg-red-50" 
                                : product.stock <= Math.ceil(product.reorderLevel * 0.5)
                                  ? "border-orange-300 bg-orange-50"
                                  : "border-yellow-300 bg-yellow-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              {/* Product Info */}
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    product.stock === 0 
                                      ? "bg-red-500 text-white" 
                                      : product.stock <= Math.ceil(product.reorderLevel * 0.5)
                                        ? "bg-orange-500 text-white"
                                        : "bg-yellow-500 text-white"
                                  }`}>
                                    {product.stock === 0 ? "OUT OF STOCK" : product.stock <= Math.ceil(product.reorderLevel * 0.5) ? "CRITICAL" : "LOW STOCK"}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-600">Category</p>
                                    <p className="font-medium text-gray-900">{product.category}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Current Stock</p>
                                    <p className={`font-bold text-lg ${
                                      product.stock === 0 ? "text-red-600" : 
                                      product.stock <= Math.ceil(product.reorderLevel * 0.5) ? "text-orange-600" : "text-yellow-600"
                                    }`}>
                                      {product.stock} units
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Reorder Level</p>
                                    <p className="font-medium text-gray-900">{product.reorderLevel} units</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Unit Price</p>
                                    <p className="font-medium text-gray-900">₹{product.price.toLocaleString()}</p>
                                  </div>
                                </div>

                                {/* Stock Progress Bar */}
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Stock Level</span>
                                    <span>{Math.round((product.stock / (product.reorderLevel * 2)) * 100)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        product.stock === 0 ? "bg-red-500" :
                                        product.stock <= Math.ceil(product.reorderLevel * 0.5) ? "bg-orange-500" : "bg-yellow-500"
                                      }`}
                                      style={{ width: `${Math.min(100, (product.stock / (product.reorderLevel * 2)) * 100)}%` }}
                                    ></div>
                                  </div>

                                  {/* Urgency Message */}
                                  <div className={`mt-3 p-2 rounded-lg text-xs font-medium ${
                                    product.stock === 0 
                                      ? "bg-red-100 text-red-800" 
                                      : product.stock <= Math.ceil(product.reorderLevel * 0.5)
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {product.stock === 0 
                                      ? "🚨 URGENT: Product is completely out of stock! Immediate reorder required."
                                      : product.stock <= Math.ceil(product.reorderLevel * 0.5)
                                        ? "🔥 CRITICAL: Stock is critically low! Reorder immediately."
                                        : "⚠️ WARNING: Stock is below reorder level. Consider restocking soon."
                                    }
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="ml-6 flex flex-col space-y-2">
                                <button
                                  onClick={() => {
                                    setSelectedProduct(product)
                                    setShowRestockModal(true)
                                    setShowStockDetailsModal(false)
                                  }}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                                >
                                  🔄 Restock
                                </button>
                                <button
                                  onClick={() => {
                                    // You can add edit functionality here
                                    alert(`Edit functionality for ${product.name} - Coming soon!`)
                                  }}
                                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => {
                                    // You can add view history functionality here
                                    alert(`Stock history for ${product.name} - Coming soon!`)
                                  }}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                                >
                                  📊 History
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">All Products Well Stocked!</h3>
                        <p className="text-gray-600">No products require immediate attention.</p>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions Section */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <span>📦</span>
                        <span>Bulk Restock</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <span>📊</span>
                        <span>Generate Report</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <span>📧</span>
                        <span>Email Alerts</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Last updated: {formatTime(currentTime)}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowStockDetailsModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        // Refresh data functionality
                        window.location.reload()
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🔄 Refresh Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
