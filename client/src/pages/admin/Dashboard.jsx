import { Package,Users,ShoppingBag,DollarSign,TrendingUp,AlertCircle,ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardInfo } from "../../Services/admin.api";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const { data,isLoading } = useQuery({
    queryKey:"dashboard-info",
    queryFn:getDashboardInfo
  });

  const nav = useNavigate();

  const adminEmail = data?.data?.adminEmail;

  const stats = data?.data?.stats;

  const topProducts = data?.data?.top_products || [];

  const topBrands = data?.data?.top_brands || [];

  const returnRequests = data?.data?.return_request || [];

  const recentOrders = data?.data?.recent_orders || [];

  const getStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    out_for_delivery: "bg-indigo-50 text-indigo-700 border-indigo-200",
    delivered: "bg-green-50 text-green-700 border-green-200",
    canceled: "bg-red-50 text-red-700 border-red-200",
  };
  return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.2s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.4s]"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white p-5">
     
      <div
        className="relative overflow-hidden rounded-xl p-5 mb-5 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-sm shadow-black/40"
        >
        <h2 className="text-lg font-semibold mb-1">Welcome back, {adminEmail} !</h2>
        <p className="text-gray-300 text-sm">
          Here's your business overview for today
        </p>
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Total Revenue
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            ${stats?.total_revenue?.toLocaleString()}
          </p>
          <p className="text-green-600 text-xs mt-2">Performance improving over time</p>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Total Orders
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats?.total_orders?.toLocaleString()}
          </p>
          <p className="text-blue-600 text-xs mt-2">Orders placed by customers</p>
        </div>

        {/* Active Users */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Active Users
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats?.active_users?.toLocaleString()}
          </p>
          <p className="text-purple-600 text-xs mt-2">Email verified accounts</p>
        </div>

        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Listed Products
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats?.listed_products?.toLocaleString()}
          </p>
          <p className="text-gray-500 text-xs mt-2">Across all categories</p>
        </div>
      </div>

      {/* Top Products and Brands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <Package className="w-4 h-4 mr-2 text-blue-600" />
            Top Products
          </h3>
          <div className="space-y-2">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    {product.productImages && product.productImages.length > 0 && (
                      <img 
                        src={product.productImages[0]} 
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 font-medium text-xs truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{product.gender}</span>
                        {product.type && (
                          <>
                            <span>•</span>
                            <span className="truncate">{product.type}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                      product.status
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {product.status ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500 text-sm">No products data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Brands */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
            Top Brands
          </h3>
          <div className="space-y-2">
            {topBrands.length > 0 ? (
              topBrands.map((brand, index) => (
                <div
                  key={brand._id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    {brand.logo && (
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        className="w-10 h-10 rounded object-contain flex-shrink-0 bg-white border border-gray-200"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 font-medium text-xs truncate">
                        {brand.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Brand ranking #{index + 1}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                      brand.status
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {brand.status ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500 text-sm">No brands data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Return Requests Alert */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-5 mb-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
          Order Return Requests
          {returnRequests.length > 0 && (
            <span className="ml-2 bg-red-200 text-red-700 text-xs px-2 py-1 rounded-full">
              {returnRequests.length} pending
            </span>
          )}
        </h3>
        {returnRequests.length > 0 ? (
          <div className="space-y-3">
            {returnRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-gray-900 text-xs font-bold">{request.orderId}</p>
                    <span className="text-gray-400">•</span>
                    <p className="text-gray-600 text-sm">{request.customer}</p>
                  </div>
                  <p className="text-gray-700 text-sm mb-1">{request.product}</p>
                  <div className="flex items-center space-x-3">
                    <span className="text-red-600 text-xs">
                      Reason: {request.reason}
                    </span>
                    <span className="text-gray-500 text-xs font-bold">{new Date(request?.date)?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                  </div>
                </div>
                <button className=" text-black px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center"
                  onClick={() => nav(`/admin/order/detail/${request.id}`)}
                >
                  Review
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-lg text-center">
            <p className="text-gray-500 text-sm">No current return requests</p>
          </div>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
          <ShoppingBag className="w-4 h-4 mr-2 text-green-600" />
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-gray-600 font-medium text-xs py-2 px-3">
                  Order ID
                </th>
                <th className="text-left text-gray-600 font-medium text-xs py-2 px-3">
                  Customer
                </th>
                <th className="text-left text-gray-600 font-medium text-xs py-2 px-3">
                  Product
                </th>
                <th className="text-left text-gray-600 font-medium text-xs py-2 px-3">
                  Amount
                </th>
                <th className="text-left text-gray-600 font-medium text-xs py-2 px-3">
                  Status
                </th>
                <th className="text-left text-gray-600 font-medium text-xs py-2 px-3">
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
                  <td className="py-3 px-3">
                    <p className="text-gray-900 font-medium text-xs">
                      {order.orderId}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-gray-700 text-xs">{order?.user_id?.name}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-gray-700 text-xs">{order.items.length} Items</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-gray-900 font-semibold text-xs">
                      ${order.total_amount}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-gray-500 text-xs">{new Date(order.order_date)?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</p>
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