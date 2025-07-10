import { useERP } from "../contexts/ERPContext"

export default function Dashboard() {
  const { getDashboardStats, products, sales } = useERP()
  const stats = getDashboardStats()

  const statCards = [
    { title: "Total Employees", value: stats.totalEmployees, icon: "👥", color: "bg-blue-500" },
    { title: "Total Products", value: stats.totalProducts, icon: "📦", color: "bg-green-500" },
    { title: "Total Sales", value: `₹${stats.totalSales.toLocaleString()}`, icon: "💰", color: "bg-yellow-500" },
    { title: "Total Expenses", value: `₹${stats.totalExpenses.toLocaleString()}`, icon: "💳", color: "bg-red-500" },
    { title: "Profit", value: `₹${stats.profit.toLocaleString()}`, icon: "📈", color: "bg-purple-500" },
    { title: "Low Stock Alert", value: stats.lowStockProducts, icon: "⚠️", color: "bg-orange-500" },
  ]

  const lowStockProducts = products.filter((p) => p.stock <= p.reorderLevel)
  const recentSales = sales.slice(-5).reverse()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your ERP System overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white text-xl`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h3>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">Stock: {product.stock} units</p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Low Stock</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">All products are well stocked!</p>
          )}
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{sale.customerName}</p>
                  <p className="text-sm text-gray-600">
                    {sale.productName} × {sale.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{sale.amount.toLocaleString()}</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      sale.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
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
    </div>
  )
}
