import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveReturn,
  changeOrderStatus,
  completeReturn,
  getOrderDetailsForAdmin,
  rejectReturn,
} from "../../Services/admin.api";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { findSubtotal } from "../../math/subtotal.math";

const OrderDetailPage = () => {
  const { id } = useParams();

  const QueryClient = useQueryClient();

  const [subtotal, setSubtotal] = useState(0);

  const { data } = useQuery({
    queryKey: ["order-details-admin", id],
    queryFn: () => getOrderDetailsForAdmin(id),
  });

  const { handleSubmit, register, reset } = useForm();

  const orderData = data?.data?.orderDoc || [];

  useEffect(() => {
    if (!orderData || !orderData.items) return;

    reset({
      status: orderData.status,
    });

    setSubtotal(findSubtotal(orderData));
  }, [orderData]);

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "out_for_delivery",
      label: "Out for Delivery",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    { value: "canceled", label: "Canceled", color: "bg-red-100 text-red-800" },
    {
      value: "returned",
      label: "Returned",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const statusFlow = [
    "pending",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];

  const currentStatusIndex = statusFlow.indexOf(orderData.status);

  const paymentStatusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-orange-100 text-orange-800",
  };

  const handleStatusChange = async (data) => {
    try {
      const res = await changeOrderStatus(data, id);

      toast.success(res.data.message);
      QueryClient.invalidateQueries("order-details-admin");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5" />;
      case "shipped":
        return <Package className="w-5 h-5" />;
      case "out_for_delivery":
        return <Truck className="w-5 h-5" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "canceled":
        return <XCircle className="w-5 h-5" />;
      case "returned":
        return <RotateCcw className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getCurrentStatusColor = () => {
    return (
      statusOptions.find((s) => s.value === orderData.status)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  const handleReturnApprove = async (orderId, itemId) => {
    try {
      const res = await approveReturn(orderId, itemId);
      toast.success("Return Approved");
      QueryClient.invalidateQueries("order-details-admin");
    } catch (err) {
      toast.error("Error approving return");
    }
  };

  const handleReturnReject = async (orderId, itemId) => {
    try {
      const res = await rejectReturn(orderId, itemId);
      toast.success("Return Rejected");
      QueryClient.invalidateQueries(["order-details-admin", id]);
    } catch (err) {
      toast.error("Error rejecting return");
    }
  };

  const handleReturnComplete = async (orderId, itemId) => {
    try {
      const res = await completeReturn(orderId, itemId);

      toast.success("Return Completed");

      QueryClient.invalidateQueries(["order-details-admin", id]);
    } catch (err) {
      toast.error("Error rejecting return", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 mt-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-3 transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Orders</span>
          </button>

          <div className="flex justify-between items-center mt-8">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-0.5 text-sm">
                Order ID: {orderData.orderId}
              </p>
            </div>

            {orderData.payment_status === "failed" && (
              <div className="flex items-center justify-center p-4">
                <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm font-medium">Razorpay payment failed</p>
                </div>
              </div>
            )}

            {orderData.status === "canceled" && (
              <div className="flex items-center justify-center p-4">
                <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm font-medium">Order Cancelled</p>
                </div>
              </div>
            )}

            {orderData.status === "returned" && (
              <div className="flex items-center justify-center p-4">
                <div className="inline-flex items-center gap-2 border border-orange-200 bg-orange-100 text-orange-800 px-4 py-2.5 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm font-medium">Order Returned</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">
                  Order Status
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getCurrentStatusColor()}`}
                >
                  {getStatusIcon(orderData.status)}
                  {
                    statusOptions.find((s) => s.value === orderData.status)
                      ?.label
                  }
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Placed on{" "}
                    {new Date(orderData.order_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Order Items
              </h2>
              <div className="space-y-3">
                {orderData?.items?.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 p-3 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={item?.product_id.productImages[0]}
                      alt={item?.product_id.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">
                        {item?.product_id.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {item.variant_id.size}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Quantity: {item.quantity}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-semibold text-sm text-gray-900">
                          ₹{item.sales_price}
                        </span>
                        {item.original_price > item.sales_price && (
                          <span className="text-xs text-gray-500 line-through">
                            ₹{item.original_price}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {!item.return_status && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusOptions.find((s) => s.value === item.status)
                              ?.color
                          }`}
                        >
                          {
                            statusOptions.find((s) => s.value === item.status)
                              ?.label
                          }
                        </span>
                      )}
                      {item.status == "canceled" ? (
                        <>
                          <p className="text-xs font-sans text-red-700 pt-2 flex gap-1">
                            <Calendar size={15} />
                            {new Date(item?.cancelledAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </>
                      ) : null}

                      {item.return_status && (
                        <div className="mt-2 text-right">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.return_status === "Requested" &&
                              "Return Requested"}
                            {item.return_status === "Approved" &&
                              "Return Approved"}
                            {item.return_status === "Rejected" &&
                              "Return Rejected"}
                            {item.return_status === "Completed" && "Returned"}
                          </span>

                          <p className="text-xs text-gray-700 mt-1 flex items-center justify-end gap-1">
                            <Calendar size={14} />
                            {new Date(item.return_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {orderData?.items?.some((i) => i.return_status) && (
              <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Return Requests
                </h2>

                <div className="space-y-3">
                  {orderData.items
                    .filter((item) => item.return_status)
                    .map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center p-3 border rounded-md"
                      >
                        <div>
                          <p className="font-semibold text-sm text-gray-900">
                            {item.product_id.name} ({item.variant_id.size})
                          </p>

                          <p className="text-xs mt-1 flex items-center gap-1 text-gray-600">
                            <Calendar size={14} />
                            {new Date(item.return_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                          {item.return_reason && (
                            <p className="text-xs italic font-bold text-gray-600 mt-1">
                              Reason: {item.return_reason}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 items-center">
                          {item.return_status === "Requested" && (
                            <>
                              <button
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded cursor-pointer"
                                onClick={() =>
                                  handleReturnApprove(orderData._id, item._id)
                                }
                              >
                                Approve ✓
                              </button>

                              <button
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded cursor-pointer"
                                onClick={() =>
                                  handleReturnReject(orderData._id, item._id)
                                }
                              >
                                Reject ✕
                              </button>
                            </>
                          )}

                          {item.return_status === "Approved" && (
                            <button
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded cursor-pointer"
                              onClick={() =>
                                handleReturnComplete(orderData._id, item._id)
                              }
                            >
                              Complete Refund ✓
                            </button>
                          )}

                          {item.return_status === "Rejected" && (
                            <p className="text-xs font-semibold text-red-700">
                              Rejected
                            </p>
                          )}

                          {item.return_status === "Completed" && (
                            <p className="text-xs font-semibold text-green-700">
                              Completed
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {orderData.status !== "canceled" &&
              orderData.status !== "returned" &&
              orderData.payment_status !== "failed" && (
                <form onSubmit={handleSubmit(handleStatusChange)}>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    {/* Label */}
                    <label className="block text-[11px] font-medium text-gray-500 mb-1">
                      Order Status
                    </label>

                    {/* Select */}
                    <select
                      {...register("status")}
                      defaultValue={orderData.status}
                      className="w-full px-2 py-1 text-[13px] font-semibold border-2 border-gray-800 rounded bg-white text-gray-800 cursor-pointer"
                    >
                      {statusFlow.map((status, index) => (
                        <option
                          key={status}
                          value={status}
                          disabled={index < currentStatusIndex}
                          className={
                            index < currentStatusIndex ? "text-gray-400" : ""
                          }
                        >
                          {status.replaceAll("_", " ").toUpperCase()}
                        </option>
                      ))}
                    </select>

                    {/* Button */}
                    <button
                      type="submit"
                      className="mt-2 w-full px-2 py-1 text-[13px] font-semibold text-white bg-gray-700 rounded cursor-pointer transition-all"
                    >
                      Update Status
                    </button>
                  </div>
                </form>
              )}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <User className="w-4 h-4 text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Customer Details
                </h2>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">
                    {orderData?.user_id?.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">
                    {orderData?.user_id?.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">
                    {orderData?.user_id?.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin className="w-4 h-4 text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Delivery Address
                </h2>
              </div>
              <div className="text-xs text-gray-900">
                <p className="font-bold">{orderData?.address_id?.name}</p>
                <p>{orderData?.address_id?.line1}</p>
                <p>
                  {orderData?.address_id?.city}, {orderData?.address_id?.state}{" "}
                  {orderData?.address_id?.pin_code}
                </p>
                <p>{orderData?.address_id?.country}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Payment Details
                </h2>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium text-gray-900 uppercase">
                    {orderData.payment_method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      paymentStatusColors[orderData.payment_status]
                    }`}
                  >
                    {orderData.payment_status}
                  </span>
                </div>
                {orderData.payment_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-medium text-gray-900 text-xs">
                      {orderData.payment_id}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {orderData?.coupon_id && (
              <div className="mb-2 p-2 rounded-md bg-green-50 border border-green-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-green-700">
                    Coupon Applied
                  </span>
                  <span className="font-bold text-green-800">
                    {orderData.coupon_code}
                  </span>
                </div>

                <div className="mt-1 text-[11px] text-green-700">
                  You saved ₹{orderData.coupon_share.toFixed()}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Order Summary
              </h2>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹ {subtotal || 0}</span>
                </div>
                {orderData.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount </span>
                    <span>-₹{orderData.discount.toFixed()}</span>
                  </div>
                )}
                {orderData?.coupon_id && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({orderData.coupon_code})</span>
                    <span>-₹{orderData.coupon_share}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₹{orderData.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="text-gray-900">
                    ₹{orderData.delivery_charge}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      ₹{orderData.total_amount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
