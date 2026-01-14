import { FaEdit } from "react-icons/fa";
import { changeCouponStatus } from "../../../Services/admin.api";
import { useQueryClient } from "@tanstack/react-query";
import { Tag } from "lucide-react";

function CouponTable({ data, isLoading,setEditCoupon,setOpenModal }) {

  const QueryClient = useQueryClient();

  const getStatusColor = (status) => {
    return status === true
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-600";
  };

  const displayCoupons = data?.data?.docs || [];

  const handleEditCoupon = async (coupon) => {

    setEditCoupon(coupon);
    setOpenModal(true);

  };

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
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3 px-5 text-center w-[15%]">Coupon Code</th>
              <th className="py-3 px-5 text-center w-[10%]">Usage Count</th>
              <th className="py-3 px-5 text-center w-[15%]">
                Minimum Purchase
              </th>
              <th className="py-3 px-5 text-center w-[15%]">Discount Value</th>
              <th className="py-3 px-5 text-center w-[15%]">Expiry Date</th>
              <th className="py-3 px-5 text-center w-[10%]">Status</th>
              <th className="py-3 px-2 text-center w-[10%]">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {displayCoupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-bold text-green-900 flex gap-2 items-center">
                   <Tag className="fill-green-50" size={18}/> {coupon.code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-700">
                    {coupon.usageCount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
                  <span className="text-sm text-blue-700">
                    ₹ {coupon.min_purchase}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-amber-700">
                    {coupon.type == "percentage"
                      ? `${coupon.value}% OFF`
                      : `₹${coupon.value} FLAT`}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-xs text-gray-700 font-bold">
                    {new Date(coupon?.end_date)?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
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
                    onClick={() => handleEditCoupon(coupon)}
                    className="p-1.5 text-blue-600 rounded transition cursor-pointer"
                    title="Edit Coupon"
                  >
                    <FaEdit size={16} />
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
