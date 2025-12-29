import React, { useState } from "react";
import {
  ArrowLeft,
  Package,
  CreditCard,
  MapPin,
  Phone,
  Download,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Dot,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrderDetails } from "../../Services/user.api";

const OrderDetail = () => {
  const nav = useNavigate();

  const { id } = useParams();

  const { data, isError } = useQuery({
    queryKey: ["order-details", id],
    queryFn: () => getOrderDetails(id),
  });

  const order = data?.data?.orderDoc || [];

  const paymentMethodLabels = {
    cod: "Cash on Delivery",
    card: "Credit/Debit Card",
    upi: "UPI Payment",
    wallet: "Wallet",
    razorpay:"Razorpay Payment"
  };

  const paymentStatusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-blue-100 text-blue-800",
  };

  const orderStages = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "shipped", label: "Shipped", icon: Package },
    { key: "out_for_delivery", label: "Out For Delivery", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const statusOrder = [
    "pending",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];

  const getStageStatus = (stageKey) => {
    const stageIndex = statusOrder.indexOf(stageKey);
    const currentStatusIndex = statusOrder.indexOf(order.status);

    return {
      completed: currentStatusIndex > stageIndex,
      active: order.status === stageKey,
    };
  };


  const handleDownloadInvoice = () => {
    
    window.open(`${import.meta.env.VITE_BASE_URL}/user/order/invoice/${order._id}`,"_blank");
  };

  if (!order) return <div className="text-center py-12">Loading...</div>;

  const subtotal = order?.items?.reduce(
    (sum, item) => sum + item.salesPrice * item.quantity,
    0
  );

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-6xl mx-auto space-y-5">
        <button
          onClick={() => nav("/account/orders")}
          className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Orders</span>
        </button>

        <div className="bg-white border rounded-sm p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.orderId}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-bold text-amber-700">
                  Order Status:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "canceled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order?.status?.replace("_", " ").toUpperCase()}
                </span>
                {/* <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentStatusColors[order.payment_status]}`}>
                  {order?.payment_status?.toUpperCase()}
                </span> */}
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Order Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(order.order_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Expected Delivery</p>
                <p className="text-sm font-semibold text-green-600">
                  3-5 Business Days
                </p>
              </div>
            </div>
          </div>
        </div>

        {order.status !== "canceled" && order.payment_status !== "failed" ? (
          <div className="bg-white border-2 border-green-700 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Order Tracking
            </h2>

            <div className="relative flex items-center justify-between">
              {orderStages.map((stage, index) => {
                const { completed, active } = getStageStatus(stage.key);

                const StageIcon = stage.icon;

                return (
                  <React.Fragment key={stage.key}>
                    <div className="flex flex-col items-center z-10">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          completed
                            ? "bg-blue-500 shadow-lg shadow-blue-200"
                            : active
                            ? "bg-blue-500 shadow-lg shadow-blue-200 animate-pulse"
                            : "bg-gray-200"
                        }`}
                      >
                        <StageIcon
                          className={`w-6 h-6 ${
                            completed || active ? "text-white" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <p
                        className={`mt-2 text-xs font-semibold text-center ${
                          completed || active
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {stage.label}
                      </p>
                    </div>

                    {index < orderStages.length - 1 && (
                      <div
                        className="flex-1 h-1 mx-2 relative"
                        style={{ top: "-20px" }}
                      >
                        <div
                          className={`h-full rounded transition-all ${
                            statusOrder.indexOf(order.status) >
                            statusOrder.indexOf(stage.key)
                              ? "bg-blue-500"
                              : "bg-gray-200"
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ) : order.status === "canceled" ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-red-900">
                  Order Cancelled
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  This order has been cancelled and no payment will be
                  processed.
                </p>
                {order.paymentStatus === "refunded" && (
                  <p className="text-sm text-red-700 mt-1">
                    Refund has been initiated and will be processed within 5-7
                    business days.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-red-900">
                  Payment Failed
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  The payment for this order has failed. Please try placing the order again or use a different payment method.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border rounded-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order?.items?.map((item) => (
                  <div
                    key={item?._id}
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item?.product_id?.productImages?.[0]}
                        alt={item?.product_id?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {item?.product_id.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {item?.variant_id.size}
                      </p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">
                          ₹
                          {item?.sales_price?.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                        {item?.variant_id?.original_price >
                          item.variant_id?.sales_price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹
                            {item?.original_price.toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        Quantity:{" "}
                        <span className="font-semibold">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      {item.status === "canceled" ? (
                        
                        <div className="flex flex-col items-end text-right">
                          <p className="flex items-center text-red-700 text-sm font-medium">
                            <Dot size={20} />
                            Canceled
                          </p>
                          {order.payment_method != "cod" ? <span className="text-green-700 font-bold ml-2 text-xs">Amount Credited To Wallet</span> : null}
                          <p className="text-xs font-semibold text-gray-600">
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
                        </div>
                      ) : item.return_status ? (
                        
                        <div className="flex flex-col items-end text-right">
                          <p className="flex items-center text-blue-700 text-sm font-medium">
                            <Dot size={20} />
                            {item.return_status === "Requested" &&
                              "Return Requested"}
                            {item.return_status === "Approved" &&
                              "Return Approved"}
                            {item.return_status === "Rejected" &&
                              "Return Rejected"}
                            {item.return_status === "Completed" && "Amount Refund To Wallet"}
                          </p>

                          <p className="text-xs font-semibold text-gray-600">
                            {new Date(item?.return_date).toLocaleDateString(
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

                          {item?.return_reason && (
                            <p className="text-xs text-gray-700 mt-1 italic">
                              Reason: {item.return_reason}
                            </p>
                          )}
                        </div>
                      ) : (
                        
                        <p className="text-base font-bold text-gray-900">
                          ₹
                          {(
                            item?.sales_price * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Payment Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment Method</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {paymentMethodLabels[order.payment_method]}
                  </span>
                </div>
                {order.paymentId && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment ID</span>
                    <span className="text-xs font-mono font-semibold text-blue-600">
                      {order.paymentId}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex gap-2 items-center">
                    <Clock size={17} />
                    Payment Status
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      paymentStatusColors[order.payment_status]
                    }`}
                  >
                    {order?.payment_status?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Delivery Address
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">
                        {order?.address_id?.name}
                      </p>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {order?.address_id?.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {order?.address_id?.line1}
                    </p>
                    {order?.address_id?.line2 && (
                      <p className="text-sm text-gray-700">
                        {order?.address_id?.line2}
                      </p>
                    )}
                    <p className="text-sm text-gray-700">
                      {order?.address_id?.city}, {order?.address_id?.state} -{" "}
                      {order?.address_id?.pin_code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    +91 {order?.address_id?.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border p-6 sticky top-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal (
                    {order?.items?.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{" "}
                    items)
                  </span>
                  <span className="text-gray-900 font-medium">
                    ₹
                    {(
                      order.total_amount -
                      order.tax -
                      order.delivery_charge +
                      order.discount
                    ).toLocaleString("en-IN")}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Discount{" "}
                      {order.couponCode && (
                        <span className="text-green-600 font-semibold">
                          ({order.couponCode})
                        </span>
                      )}
                    </span>
                    <span className="text-green-600 font-medium">
                      -₹{order?.discount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="text-gray-900 font-medium">
                    {order.deliveryCharge === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${order?.delivery_charge?.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax & Fees</span>
                  <span className="text-gray-900 font-medium">
                    ₹{order?.tax?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{order?.total_amount?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full px-3 py-2 text-sm font-medium text-blue-700 cursor-pointer border border-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;