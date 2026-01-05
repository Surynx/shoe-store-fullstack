import { FaEye, FaCheckCircle, FaTruck, FaClock, FaTimesCircle, FaBox, FaCheck, FaShippingFast, FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderTable = ({ data, isLoading }) => {
  let orders = data?.data?.docs || [];  
  const nav = useNavigate();


  const getStatusConfig = (status) => {
    const configs = {
      'pending': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: FaClock,
        label: 'Pending'
      },
      'confirmed': {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: FaCheck,
        label: 'Confirmed'
      },
      'shipped': {
        bg: 'bg-indigo-100',
        text: 'text-indigo-700',
        icon: FaTruck,
        label: 'Shipped'
      },
      'out_for_delivery': {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        icon: FaShippingFast,
        label: 'Out for Delivery'
      },
      'delivered': {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: FaCheckCircle,
        label: 'Delivered'
      },
      'canceled': {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: FaTimesCircle,
        label: 'Canceled'
      },
      'returned': {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        icon: FaUndo,
        label: 'Returned'
      }
    };

    return configs[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      icon: FaBox,
      label: status
    };
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-sm p-8 text-center">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <table className="w-full text-sm font-medium text-gray-700">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="py-3 px-5 text-left w-[20%]">Order ID</th>
            <th className="py-3 px-5 text-left w-[18%]">Date</th>
            <th className="py-3 px-5 text-left w-[20%]">Customer</th>
            <th className="py-3 px-5 text-center w-[10%]">Items</th>
            <th className="py-3 px-5 text-right w-[15%]">Amount</th>
            <th className="py-3 px-5 text-center w-[15%]">Status</th>
            <th className="py-3 px-5 text-center w-[10%]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="py-4 px-5 font-bold text-blue-600">
                    {order.orderId}
                  </td>
                  <td className="py-4 px-5 text-gray-600">
                    {new Date(order?.order_date)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-5">
                    <div>
                      <div className="font-semibold text-gray-800">{order.user[0].name}</div>
                      <div className="text-xs text-gray-500">{order.user[0].email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-center font-semibold">
                    {order.items.length}
                  </td>
                  <td className="py-4 px-5 text-right font-bold text-gray-800">
                    ₹{order?.total_amount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      <StatusIcon className="text-xs" />
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <button
                      onClick={() => nav(`/admin/order/detail/${order._id}`)}
                      className="text-blue-600 hover:text-blue-800 text-lg cursor-pointer inline-flex items-center gap-1 transition-colors"
                      title="View Order Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center py-10 text-gray-400 italic text-sm"
              >
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;