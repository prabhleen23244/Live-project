import { createContext, useContext, useState } from "react"

const ERPContext = createContext(undefined)

export function ERPProvider({ children }) {
  // Employees Data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@company.com",
      position: "Senior Developer",
      salary: 75000,
      attendance: 22,
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya@company.com",
      position: "UI/UX Designer",
      salary: 55000,
      attendance: 20,
      status: "Active",
      joinDate: "2023-03-10",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@company.com",
      position: "Project Manager",
      salary: 85000,
      attendance: 23,
      status: "Active",
      joinDate: "2022-11-20",
    },
    {
      id: 4,
      name: "Sneha Patel",
      email: "sneha@company.com",
      position: "Marketing Executive",
      salary: 45000,
      attendance: 18,
      status: "Active",
      joinDate: "2023-05-08",
    },
    {
      id: 5,
      name: "Vikash Gupta",
      email: "vikash@company.com",
      position: "Sales Manager",
      salary: 65000,
      attendance: 21,
      status: "On Leave",
      joinDate: "2023-02-14",
    },
  ])

  // Products Data
  const [products, setProducts] = useState([
    { id: 1, name: "MacBook Pro", category: "Electronics", stock: 25, price: 120000, reorderLevel: 5 },
    { id: 2, name: "Wireless Mouse", category: "Accessories", stock: 150, price: 1500, reorderLevel: 20 },
    { id: 3, name: "Mechanical Keyboard", category: "Accessories", stock: 3, price: 8500, reorderLevel: 10 }, // Low stock
    { id: 4, name: "4K Monitor", category: "Electronics", stock: 45, price: 25000, reorderLevel: 8 },
    { id: 5, name: "Office Chair", category: "Furniture", stock: 12, price: 15000, reorderLevel: 5 },
    { id: 6, name: "Desk Lamp", category: "Furniture", stock: 2, price: 3500, reorderLevel: 8 }, // Low stock
    { id: 7, name: "Smartphone", category: "Electronics", stock: 80, price: 35000, reorderLevel: 15 },
    { id: 8, name: "Tablet", category: "Electronics", stock: 35, price: 28000, reorderLevel: 10 },
    { id: 9, name: "Headphones", category: "Accessories", stock: 95, price: 5500, reorderLevel: 25 },
    { id: 10, name: "Webcam", category: "Electronics", stock: 0, price: 4500, reorderLevel: 5 }, // Out of stock
    { id: 11, name: "USB Cable", category: "Accessories", stock: 1, price: 500, reorderLevel: 15 }, // Critical low
    { id: 12, name: "Power Bank", category: "Electronics", stock: 4, price: 2500, reorderLevel: 10 }, // Low stock
  ])

  // Sales Data
  const [sales, setSales] = useState([
    {
      id: 1,
      customerName: "TechCorp Solutions",
      productName: "MacBook Pro",
      quantity: 5,
      amount: 600000,
      date: "2024-01-20",
      status: "Completed",
    },
    {
      id: 2,
      customerName: "StartupHub",
      productName: "Wireless Mouse",
      quantity: 25,
      amount: 37500,
      date: "2024-01-19",
      status: "Pending",
    },
    {
      id: 3,
      customerName: "Digital Agency",
      productName: "4K Monitor",
      quantity: 8,
      amount: 200000,
      date: "2024-01-18",
      status: "Completed",
    },
    {
      id: 4,
      customerName: "Creative Studio",
      productName: "Office Chair",
      quantity: 12,
      amount: 180000,
      date: "2024-01-17",
      status: "Completed",
    },
    {
      id: 5,
      customerName: "E-commerce Co",
      productName: "Smartphone",
      quantity: 15,
      amount: 525000,
      date: "2024-01-16",
      status: "Processing",
    },
    {
      id: 6,
      customerName: "Media House",
      productName: "Tablet",
      quantity: 6,
      amount: 168000,
      date: "2024-01-15",
      status: "Completed",
    },
    {
      id: 7,
      customerName: "Gaming Center",
      productName: "Headphones",
      quantity: 20,
      amount: 110000,
      date: "2024-01-14",
      status: "Completed",
    },
  ])

  // Finance Data
  const [expenses, setExpenses] = useState([
    { id: 1, category: "Office Rent", amount: 45000, date: "2024-01-01", description: "Monthly office rent payment" },
    { id: 2, category: "Utilities", amount: 8500, date: "2024-01-05", description: "Electricity and water bills" },
    { id: 3, category: "Marketing", amount: 25000, date: "2024-01-10", description: "Social media advertising campaign" },
    { id: 4, category: "Software Licenses", amount: 15000, date: "2024-01-12", description: "Annual software subscriptions" },
    { id: 5, category: "Travel", amount: 12000, date: "2024-01-14", description: "Client meeting travel expenses" },
    { id: 6, category: "Office Supplies", amount: 5500, date: "2024-01-16", description: "Stationery and office materials" },
    { id: 7, category: "Internet", amount: 3500, date: "2024-01-18", description: "Monthly internet connection" },
    { id: 8, category: "Training", amount: 18000, date: "2024-01-20", description: "Employee skill development program" },
  ])

  // Add Employee
  const addEmployee = (employee) => {
    const newEmployee = { ...employee, id: Date.now(), attendance: 0, status: "Active", joinDate: new Date().toISOString().split("T")[0] }
    setEmployees([...employees, newEmployee])
  }

  // Add Product
  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() }
    setProducts([...products, newProduct])
  }

  // Add Sale with real-time stock update
  const addSale = (sale) => {
    const newSale = { ...sale, id: Date.now(), date: new Date().toISOString().split("T")[0] }
    setSales([...sales, newSale])

    // Update product stock in real-time
    const product = products.find((p) => p.name === sale.productName)
    if (product) {
      const updatedProducts = products.map((p) =>
        p.name === sale.productName ? { ...p, stock: Math.max(0, p.stock - Number.parseInt(sale.quantity)) } : p,
      )
      setProducts(updatedProducts)
      
      // Show alert if stock becomes low after sale
      const updatedProduct = updatedProducts.find(p => p.name === sale.productName)
      if (updatedProduct.stock <= updatedProduct.reorderLevel && updatedProduct.stock > 0) {
        setTimeout(() => {
          alert(`⚠️ LOW STOCK ALERT!\n\n${updatedProduct.name} is now running low!\nCurrent Stock: ${updatedProduct.stock} units\nReorder Level: ${updatedProduct.reorderLevel} units\n\nPlease reorder soon!`)
        }, 1000)
      } else if (updatedProduct.stock === 0) {
        setTimeout(() => {
          alert(`🚨 OUT OF STOCK ALERT!\n\n${updatedProduct.name} is now OUT OF STOCK!\n\nPlease reorder immediately!`)
        }, 1000)
      }
    }
  }

  // Add Expense
  const addExpense = (expense) => {
    const newExpense = { ...expense, id: Date.now(), date: new Date().toISOString().split("T")[0] }
    setExpenses([...expenses, newExpense])
  }

  // Delete functions
  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
  }

  const deleteProduct = (id) => {
    setProducts(products.filter((prod) => prod.id !== id))
  }

  const deleteSale = (id) => {
    setSales(sales.filter((sale) => sale.id !== id))
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id))
  }

  // Update functions
  const updateProduct = (id, updatedData) => {
    setProducts(products.map((prod) => (prod.id === id ? { ...prod, ...updatedData } : prod)))
  }

  const updateEmployee = (id, updatedData) => {
    setEmployees(employees.map((emp) => (emp.id === id ? { ...emp, ...updatedData } : emp)))
  }

  // Restock product function
  const restockProduct = (id, quantity) => {
    setProducts(products.map((prod) => 
      prod.id === id ? { ...prod, stock: prod.stock + quantity } : prod
    ))
  }

  // Get stock status for any product
  const getStockStatus = (product) => {
    if (product.stock === 0) {
      return { 
        status: "Out of Stock", 
        color: "bg-red-500", 
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        priority: "critical"
      }
    }
    if (product.stock <= product.reorderLevel) {
      return { 
        status: "Low Stock", 
        color: "bg-yellow-500", 
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
        priority: "warning"
      }
    }
    return { 
      status: "In Stock", 
      color: "bg-green-500", 
      textColor: "text-green-700",
      bgColor: "bg-green-50",
      priority: "good"
    }
  }

  // Calculate Dashboard Stats with detailed stock analysis
  const getDashboardStats = () => {
    const totalEmployees = employees.length
    const activeEmployees = employees.filter((emp) => emp.status === "Active").length
    const totalProducts = products.length
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    // Detailed stock analysis
    const outOfStockProducts = products.filter((p) => p.stock === 0).length
    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= p.reorderLevel).length
    const criticalStockProducts = products.filter((p) => p.stock <= Math.ceil(p.reorderLevel * 0.5)).length
    const wellStockedProducts = products.filter((p) => p.stock > p.reorderLevel).length
    
    const pendingSales = sales.filter((s) => s.status === "Pending" || s.status === "Processing").length
    const completedSales = sales.filter((s) => s.status === "Completed").length

    return {
      totalEmployees,
      activeEmployees,
      totalProducts,
      totalSales,
      totalExpenses,
      profit: totalSales - totalExpenses,
      outOfStockProducts,
      lowStockProducts,
      criticalStockProducts,
      wellStockedProducts,
      pendingSales,
      completedSales,
    }
  }

  // Get low stock products with details
  const getLowStockProducts = () => {
    return products.filter((p) => p.stock <= p.reorderLevel).map(product => ({
      ...product,
      stockStatus: getStockStatus(product)
    }))
  }

  // Get critical stock products (very urgent)
  const getCriticalStockProducts = () => {
    return products.filter((p) => p.stock <= Math.ceil(p.reorderLevel * 0.5))
  }

  const value = {
    employees,
    products,
    sales,
    expenses,
    addEmployee,
    addProduct,
    addSale,
    addExpense,
    deleteEmployee,
    deleteProduct,
    deleteSale,
    deleteExpense,
    updateProduct,
    updateEmployee,
    restockProduct,
    getDashboardStats,
    getLowStockProducts,
    getCriticalStockProducts,
    getStockStatus,
  }

  return <ERPContext.Provider value={value}>{children}</ERPContext.Provider>
}

export function useERP() {
  const context = useContext(ERPContext)
  if (context === undefined) {
    throw new Error("useERP must be used within an ERPProvider")
  }
  return context
}
