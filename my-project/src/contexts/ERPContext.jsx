import { createContext, useContext, useState } from "react"

const ERPContext = createContext(undefined)

export function ERPProvider({ children }) {
  
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@company.com",
      position: "Developer",
      salary: 50000,
      attendance: 22,
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya@company.com",
      position: "Designer",
      salary: 45000,
      attendance: 20,
      status: "Active",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@company.com",
      position: "Manager",
      salary: 70000,
      attendance: 23,
      status: "Active",
    },
  ])


  const [products, setProducts] = useState([
    { id: 1, name: "Laptop", category: "Electronics", stock: 25, price: 50000, reorderLevel: 5 },
    { id: 2, name: "Mouse", category: "Electronics", stock: 100, price: 500, reorderLevel: 20 },
    { id: 3, name: "Keyboard", category: "Electronics", stock: 3, price: 1500, reorderLevel: 10 },
    { id: 4, name: "Monitor", category: "Electronics", stock: 15, price: 15000, reorderLevel: 5 },
  ])

  
  const [sales, setSales] = useState([
    {
      id: 1,
      customerName: "ABC Company",
      productName: "Laptop",
      quantity: 2,
      amount: 100000,
      date: "2024-01-15",
      status: "Completed",
    },
    {
      id: 2,
      customerName: "XYZ Corp",
      productName: "Mouse",
      quantity: 10,
      amount: 5000,
      date: "2024-01-16",
      status: "Pending",
    },
    {
      id: 3,
      customerName: "Tech Solutions",
      productName: "Monitor",
      quantity: 3,
      amount: 45000,
      date: "2024-01-17",
      status: "Completed",
    },
  ])

  
  const [expenses, setExpenses] = useState([
    { id: 1, category: "Office Rent", amount: 25000, date: "2024-01-01", description: "Monthly office rent" },
    { id: 2, category: "Utilities", amount: 5000, date: "2024-01-05", description: "Electricity bill" },
    { id: 3, category: "Marketing", amount: 15000, date: "2024-01-10", description: "Social media ads" },
  ])

  
  const addEmployee = (employee) => {
    const newEmployee = { ...employee, id: Date.now(), attendance: 0, status: "Active" }
    setEmployees([...employees, newEmployee])
  }

  
  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() }
    setProducts([...products, newProduct])
  }

  
  const addSale = (sale) => {
    const newSale = { ...sale, id: Date.now(), date: new Date().toISOString().split("T")[0] }
    setSales([...sales, newSale])

    
    const product = products.find((p) => p.name === sale.productName)
    if (product) {
      const updatedProducts = products.map((p) =>
        p.name === sale.productName ? { ...p, stock: p.stock - Number.parseInt(sale.quantity) } : p,
      )
      setProducts(updatedProducts)
    }
  }

  
  const addExpense = (expense) => {
    const newExpense = { ...expense, id: Date.now(), date: new Date().toISOString().split("T")[0] }
    setExpenses([...expenses, newExpense])
  }

  
  const getDashboardStats = () => {
    const totalEmployees = employees.length
    const totalProducts = products.length
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const lowStockProducts = products.filter((p) => p.stock <= p.reorderLevel).length
    const pendingSales = sales.filter((s) => s.status === "Pending").length

    return {
      totalEmployees,
      totalProducts,
      totalSales,
      totalExpenses,
      profit: totalSales - totalExpenses,
      lowStockProducts,
      pendingSales,
    }
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
    getDashboardStats,
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
