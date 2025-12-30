import React, { useEffect, useState } from "react";
import { Package,Users,ShoppingBag,DollarSign,TrendingUp,AlertCircle,ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardInfo } from "../../Services/admin.api";

function Dashboard() {

  const {data} = useQuery({
    queryKey:"dashboard-info",
    queryFn:getDashboardInfo
  });

  const adminEmail = data?.data?.adminEmail;

  const stats = {
    totalRevenue: 145680.5,
    totalOrders: 1247,
    activeUsers: 3892,
    listedProducts: 456,
  };

  const topProducts = [
    { id: 1, name: "Wireless Headphones Pro", sales: 342, revenue: 51300 },
    { id: 2, name: "Smart Watch Series 5", sales: 289, revenue: 72250 },
    { id: 3, name: "Laptop Stand Aluminum", sales: 234, revenue: 11700 },
    { id: 4, name: "USB-C Hub 7-in-1", sales: 198, revenue: 9900 },
    { id: 5, name: "Mechanical Keyboard RGB", sales: 187, revenue: 18700 },
  ];

  const topBrands = [
    { id: 1, name: "TechPro", orders: 456, growth: "+12%" },
    { id: 2, name: "SmartLife", orders: 389, growth: "+8%" },
    { id: 3, name: "AudioMax", orders: 312, growth: "+15%" },
    { id: 4, name: "HomeEssentials", orders: 267, growth: "+5%" },
    { id: 5, name: "FitGear", orders: 234, growth: "+10%" },
  ];

  const returnRequests = [
    {
      id: 1,
      orderId: "ORD-2847",
      customer: "John Smith",
      product: "Wireless Headphones",
      reason: "Defective item",
      date: "2 hours ago",
    },
    {
      id: 2,
      orderId: "ORD-2839",
      customer: "Sarah Johnson",
      product: "Smart Watch",
      reason: "Wrong size",
      date: "5 hours ago",
    },
    {
      id: 3,
      orderId: "ORD-2831",
      customer: "Mike Davis",
      product: "Laptop Stand",
      reason: "Not as described",
      date: "1 day ago",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-2850",
      customer: "Emily Chen",
      product: "USB-C Hub",
      amount: 49.99,
      status: "Processing",
      date: "10 min ago",
    },
    {
      id: "ORD-2849",
      customer: "David Wilson",
      product: "Mechanical Keyboard",
      amount: 129.99,
      status: "Shipped",
      date: "25 min ago",
    },
    {
      id: "ORD-2848",
      customer: "Lisa Anderson",
      product: "Smart Watch",
      amount: 249.99,
      status: "Delivered",
      date: "1 hour ago",
    },
    {
      id: "ORD-2847",
      customer: "John Smith",
      product: "Wireless Headphones",
      amount: 149.99,
      status: "Return Requested",
      date: "2 hours ago",
    },
    {
      id: "ORD-2846",
      customer: "Rachel Green",
      product: "Laptop Stand",
      amount: 39.99,
      status: "Delivered",
      date: "3 hours ago",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Processing: "bg-blue-50 text-blue-700 border-blue-200",
      Shipped: "bg-purple-50 text-purple-700 border-purple-200",
      Delivered: "bg-green-50 text-green-700 border-green-200",
      "Return Requested": "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="w-full min-h-screen bg-white p-6">
      {/* Welcome Header */}
      <div
        className="relative overflow-hidden rounded-xl p-6 mb-5 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-sm shadow-black/40"
        >
        <h2 className="text-lg font-semibold mb-1">Welcome back, {adminEmail} !</h2>
        <p className="text-gray-300 text-xs">
          Here's your business overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Total Revenue
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-green-600 text-xs mt-2">+12.5% from last month</p>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Total Orders
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalOrders.toLocaleString()}
          </p>
          <p className="text-blue-600 text-xs mt-2">+8.3% from last month</p>
        </div>

        {/* Active Users */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Active Users
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.activeUsers.toLocaleString()}
          </p>
          <p className="text-purple-600 text-xs mt-2">+15.2% from last month</p>
        </div>

        {/* Listed Products */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Listed Products
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.listedProducts}
          </p>
          <p className="text-gray-500 text-xs mt-2">Across all categories</p>
        </div>
      </div>

      {/* Top Products and Brands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Top Products
          </h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium text-sm">
                      {product.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <p className="text-green-600 font-semibold">
                  ${product.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Brands */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Top Brands by Orders
          </h3>
          <div className="space-y-3">
            {topBrands.map((brand, index) => (
              <div
                key={brand.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium text-sm">
                      {brand.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {brand.orders} orders
                    </p>
                  </div>
                </div>
                <p className="text-green-600 font-semibold text-sm">
                  {brand.growth}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Return Requests Alert */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
          Order Return Requests
          <span className="ml-2 bg-red-200 text-red-700 text-xs px-2 py-1 rounded-full">
            {returnRequests.length} pending
          </span>
        </h3>
        <div className="space-y-3">
          {returnRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-gray-900 font-medium">{request.orderId}</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-gray-600 text-sm">{request.customer}</p>
                </div>
                <p className="text-gray-700 text-sm mb-1">{request.product}</p>
                <div className="flex items-center space-x-3">
                  <span className="text-red-600 text-xs">
                    Reason: {request.reason}
                  </span>
                  <span className="text-gray-500 text-xs">{request.date}</span>
                </div>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                Review
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-gray-600 font-medium text-sm py-3 px-4">
                  Order ID
                </th>
                <th className="text-left text-gray-600 font-medium text-sm py-3 px-4">
                  Customer
                </th>
                <th className="text-left text-gray-600 font-medium text-sm py-3 px-4">
                  Product
                </th>
                <th className="text-left text-gray-600 font-medium text-sm py-3 px-4">
                  Amount
                </th>
                <th className="text-left text-gray-600 font-medium text-sm py-3 px-4">
                  Status
                </th>
                <th className="text-left text-gray-600 font-medium text-sm py-3 px-4">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <p className="text-gray-900 font-medium text-sm">
                      {order.id}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-700 text-sm">{order.customer}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-700 text-sm">{order.product}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-900 font-semibold text-sm">
                      ${order.amount}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-500 text-sm">{order.date}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
