import { FaEdit, FaTrash } from "react-icons/fa";
import { changeCouponStatus } from "../../../Services/admin.api";
import toast from "react-hot-toast";
import { queryOptions, useQueryClient } from "@tanstack/react-query";

function CouponTable({ data, isLoading }) {

  const QueryClient= useQueryClient();

  const getStatusColor = (status) => {
    return status === true
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-600";
  };

  const displayCoupons = data?.data?.docs || [];

  const handleCouponStatus= async (id) => {
    
    const res= await changeCouponStatus(id);

    if(res) {

        toast.success(res.data.message);
        QueryClient.invalidateQueries("coupon-data");
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-sm p-8 text-center">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Coupon Code
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Usage Count
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Minimum-Purchase
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Discount Value
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {displayCoupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-bold text-gray-900">
                    {coupon.code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-700">{coupon.usageCount}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-700">
                    ₹ {coupon.min_purchase}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {coupon.type == "percentage"
                      ? `${coupon.value}% OFF`
                      : `₹${coupon.value} FLAT`}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-700">
                    {coupon.end_date.substring(0, 10)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-sans rounded-full ${getStatusColor(
                      coupon.status
                    )}`}
                  >
                    {coupon.status ? "List" : "Unlist"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={()=>handleCouponStatus(coupon._id)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      coupon.status
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                    title={`Toggle status`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        coupon.status
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayCoupons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No coupons found</p>
        </div>
      )}
    </div>
  );
}

export default CouponTable;