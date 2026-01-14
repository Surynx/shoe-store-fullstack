import { useEffect, useState } from "react";
import {
  Package,
  Calendar,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  IndianRupee,
  Dot,
  X,
  RotateCcw,
  RefreshCcw,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelOrder,
  cancelSingleItem,
  createPaymentRetryOrder,
  getAllOrders,
  handleReturnItem,
  markPaymentFailed,
  verifyCheckoutPayment,
} from "../../Services/user.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Pagination from "../../components/admin/Pagination";
import SearchBox from "../../components/admin/SearchBox";
import useDebounce from "../../hooks/useDebounce";

const OrderListingPage = () => {


  const [search, setSearch] = useState("");

  const [page,setPage]= useState(1);

  const debounce = useDebounce(search)

  const { data } = useQuery({
    queryKey: ["orderListing",debounce,page],
    queryFn: ()=> getAllOrders(debounce,page),
  });

  const limit= data?.data?.limit;
  const total= data?.data?.total_doc;

  const totalPages = Math.ceil(total / limit);

  const nav = useNavigate();

  const QueryClient = useQueryClient();

  const orderDocs = data?.data?.orderDocs || [];

  useEffect(() => {
    if (orderDocs.length > 0) {
      setOrders(orderDocs);
    }
  }, [orderDocs]);

  const [orders, setOrders] = useState(orderDocs);

  const [cancelTarget, setCancelTarget] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [returnTarget, setReturnTarget] = useState(null);

  const [showReturnModal, setShowReturnModal] = useState(false);

  const [returnReason, setReturnReason] = useState("");

  const [customReturnReason, setCustomReturnReason] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "returned":
        return <RotateCcw className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleCancelOrder = (order_id, item_id = null) => {

    if (item_id) {
      setCancelTarget({ order_id, item_id });
    } else {
      setCancelTarget({ order_id });
    }

    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {

      let res;
      if (cancelTarget?.item_id) {

        res = await cancelSingleItem(cancelTarget);

      } else {

        res = await cancelOrder(cancelTarget);
      }

      if (res?.data?.success) {
        toast.success(res.data.message);
        QueryClient.invalidateQueries("orderListing");
      }
    } catch (error) {

      toast.error(error.response.data.message);
      
    } finally {
      setShowCancelModal(false);
    }
  };

  const handleReturnOrder = (order_id, item_id) => {
    setReturnTarget({ order_id, item_id });
    setReturnReason("");
    setCustomReturnReason("");
    setShowReturnModal(true);
  };

  const confirmReturn = async () => {

    if (!returnReason.trim()) {
      toast.error("Select a Return Reason From DropDown!");
      return;
    }

    if (returnReason == "Other" && !customReturnReason) {
      toast.error("Custom message should not be empty!");
      return;
    }

    const reason = returnReason == "Other" ? customReturnReason : returnReason;

    try {
      const res = await handleReturnItem(returnTarget, { returnReason });

      toast.success(res?.data?.message);
      QueryClient.invalidateQueries("orderListing");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setShowReturnModal(false);
  };

  const handleRetryPayment = async (id) => {
    try {
      const razorpayRes = await createPaymentRetryOrder(id);

      if (razorpayRes && razorpayRes.data.success) {
        const order = razorpayRes.data.order;

        let total_amount = order.amount / 100;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Comet",
          description: "Retry Failed Payment",
          order_id: order.id,

          handler: async (response) => {
            try {
              const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
              } = response;

              const res = await verifyCheckoutPayment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                source: "retry",
              });

              if (res && res.data.success) {
                const orderId = res.data.orderId;
                nav(`/order/success/${orderId}`, { state: total_amount });
              }
            } catch (error) {
              console.log(error);
              toast.error(error.response.data.message);
            }
          },
          modal: {
            ondismiss: async () => {
              toast.error("Payment cancelled. You can try again.");
            },
          },

          theme: {
            color: "#0f172a",
          },
        };

        const razorpay = new window.Razorpay(options);

        //error handling
        razorpay.on("payment.failed", async (response) => {
          try {
            razorpay.close();

            const res = await markPaymentFailed({
              razorpay_order_id: order.id,
            });

            if (res && res.data.success) {
              const orderId = res.data.orderId;
              const id = res.data.id;
              const total = res.data.total;

              sessionStorage.setItem(
                "payment_failed_data",
                JSON.stringify({ total, orderId })
              );

              setTimeout(() => {
                window.location.replace(`/payment/failed/${id}`);
              }, 500);
            }
          } catch (error) {
            console.log(error);
          }
        });

        razorpay.open();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500">Track and manage your orders</p>
      </div>
      <div>
        <SearchBox search={search} setSearch={setSearch}/>
      </div>
      {orderDocs.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900">
            No orders found
          </h3>
          <p className="text-sm text-gray-500">Try adjusting your search</p>
        </div>
      )}

      <div className="space-y-3">
        {orderDocs.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-md border border-gray-500 p-4"
          >
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold">{order.orderId}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(order.order_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <span
                className={`px-2 rounded-full text-xs font-sans flex items-center gap-1 ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {order.payment_status === "failed" && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Payment Failed
                    </span>
                  </div>
                  <button
                    onClick={() => handleRetryPayment(order._id)}
                    className="px-3 py-1.5 text-xs text-white rounded-sm cursor-pointer flex gap-1 items-center border bg-gray-600 hover:bg-gray-700"
                  >
                    Retry Payment <RefreshCcw size={15} />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2 mb-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.product_id.productImages[0]}
                    className="w-12 h-12 rounded-md object-cover"
                    alt=""
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium text-gray-900 truncate`}>
                      {item.product_id.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × ₹
                      {item.sales_price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {(order.status === "pending" ||
                    order.status === "confirmed") &&
                    item.status != "canceled" &&
                    order.payment_status !== "failed" && (
                      <button
                        onClick={() => handleCancelOrder(order._id, item._id)}
                        className="text-red-600 text-xs  border px-2 py-1 font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  {item.status != "canceled" || (
                    <div className="flex flex-col items-end text-right">
                      <p className="flex items-center text-red-700 text-sm font-medium">
                        <Dot size={28} />
                        Canceled
                      </p>
                      {order.payment_method != "cod" ? (
                        <span className="text-green-700 font-bold ml-2 text-xs">
                          Amount Credited To Wallet
                        </span>
                      ) : null}
                      <p className="text-xs font-bold text-gray-600">
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
                  )}

                  {item.return_status ? (
                    <div className="flex flex-col items-end text-right">
                      <p className="flex items-center text-blue-700 text-sm font-medium">
                        <Dot size={28} />
                        {item.return_status === "Requested" &&
                          "Return Requested"}
                        {item.return_status === "Approved" && "Return Approved"}
                        {item.return_status === "Rejected" && "Return Rejected"}
                        {item.return_status === "Completed" &&
                          "Amount Refund To Wallet"}
                      </p>

                      <p className="text-xs font-bold text-gray-600">
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
                    </div>
                  ) : (
                    item.status === "delivered" && (
                      <button
                        onClick={() => handleReturnOrder(order._id, item._id)}
                        className="px-2 py-1 text-xs border text-red-700 border-red-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Return
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-3">
              <div className="flex items-center gap-1 font-semibold">
                <IndianRupee className="w-4 h-4" />
                {order.total_amount.toLocaleString("en-IN")}
              </div>

              <div className="flex gap-2">
                <button
                  className="cursor-pointer px-3 py-1.5 text-xs bg-gray-100 rounded-lg flex items-center gap-1"
                  onClick={() => nav(`/account/order/detail/${order._id}`)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Details
                </button>

                {(order.status === "pending" || order.status === "confirmed") &&
                  order.payment_status !== "failed" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages}/>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-md p-5 rounded-md shadow-md">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute right-2 top-2 text-gray-500 hover:text-black text-lg leading-none cursor-pointer"
            >
              ×
            </button>

            <h3 className="text-base font-semibold mb-3">
              {cancelTarget?.item ? "Cancel This Item?" : "Cancel This Order?"}
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to proceed? This action cannot be undone.
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-100 p-2 text-xs rounded-sm cursor-pointer"
              >
                Go Back
              </button>

              <button
                onClick={confirmCancel}
                className="flex-1 bg-red-600 text-white p-2 text-xs rounded-sm cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
   

      
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl relative transform animate-in zoom-in-95 duration-200">
       
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Return Product
                  </h3>
                  <p className="text-xs text-gray-500">
                    Please provide a reason for your return
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReturnModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => {
                    setReturnReason(e.target.value);
                    if (e.target.value !== "Other") setCustomReturnReason("");
                  }}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none transition-all bg-gray-50 hover:bg-white"
                >
                  <option value="">Select a reason</option>
                  <option value="Defective or damaged product">
                    Defective or damaged product
                  </option>
                  <option value="Wrong item received">
                    Wrong item received
                  </option>
                  <option value="Item not as described">
                    Item not as described
                  </option>
                  <option value="No longer needed">No longer needed</option>
                  <option value="Found better price elsewhere">
                    Found better price elsewhere
                  </option>
                  <option value="Quality not satisfactory">
                    Quality not satisfactory
                  </option>
                  <option value="Size or fit issue">Size or fit issue</option>
                  <option value="Other">Other (please specify)</option>
                </select>
              </div>

              {returnReason === "Other" && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                  
                    value={customReturnReason}
                    onChange={(e) => setCustomReturnReason(e.target.value)}
                    placeholder="Please describe your reason for return..."
                    className="w-full border border-gray-300 p-3 rounded-lg text-sm outline-none transition-all resize-none"
                    rows="4"
                  />
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Return Policy</p>
                  <p className="text-blue-700">
                    Returns are accepted within 30 days of delivery. Items must
                    be unused and in original packaging.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setReturnReason("");
                  setCustomReturnReason("");
                }}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReturn}
                className="flex-1 bg-red-600 text-white py-2 rounded-md text-xs font-medium hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Submit Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListingPage;
