import { RefreshCw, Package } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { createPaymentRetryOrder,verifyCheckoutPayment } from "../../Services/user.api";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

function PaymentFailed() {
  
  const navigate = useNavigate();

  const { id } = useParams();

  const [ orderData,setOrderData ] = useState(null);

  useEffect(() => {

    const data = sessionStorage.getItem("payment_failed_data");

    if (data) {

      const parsed = JSON.parse(data);
      setOrderData(parsed);
      
      sessionStorage.removeItem("payment_failed_data");
    }
  }, []);

  const orderId = orderData?.orderId;

  const amount = orderData?.total;

  const errorCode = "PAYMENT_FAILED";

  const handleRetryPayment = async () => {

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

                navigate(`/order/success/${orderId}`, { state: total_amount });
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

        razorpay.open();
      }
    } catch (error) {

      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-6">
      <div className="max-w-lg w-full bg-gray-50 rounded-lg border border-gray-300 shadow-md p-6 md:p-8">
        <div className="flex justify-center mb-5">
          <div className="w-28 h-28 flex items-center justify-center relative">
            <svg
              width="120"
              height="110"
              viewBox="0 0 180 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>

                {/* Triangle gradient - pink */}
                <linearGradient
                  id="triangleGrad"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FF6B9D" />
                  <stop offset="100%" stopColor="#C026D3" />
                </linearGradient>

                {/* Glossy highlight */}
                <linearGradient id="gloss" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>

                {/* Shadow filter */}
                <filter id="softShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                  <feOffset dx="0" dy="6" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Credit Card */}
              <g filter="url(#softShadow)">
                {/* Card base */}
                <rect
                  x="20"
                  y="30"
                  width="120"
                  height="75"
                  rx="12"
                  fill="url(#cardGrad)"
                />

                {/* Glossy overlay */}
                <rect
                  x="20"
                  y="30"
                  width="120"
                  height="75"
                  rx="12"
                  fill="url(#gloss)"
                />

                {/* Yellow chip */}
                <rect
                  x="32"
                  y="48"
                  width="20"
                  height="16"
                  rx="4"
                  fill="#FCD34D"
                />

                {/* Card number lines */}
                <rect
                  x="32"
                  y="75"
                  width="22"
                  height="5"
                  rx="2.5"
                  fill="#E0E7FF"
                  opacity="0.9"
                />
                <rect
                  x="58"
                  y="75"
                  width="22"
                  height="5"
                  rx="2.5"
                  fill="#E0E7FF"
                  opacity="0.9"
                />
                <rect
                  x="84"
                  y="75"
                  width="22"
                  height="5"
                  rx="2.5"
                  fill="#E0E7FF"
                  opacity="0.9"
                />
                <rect
                  x="110"
                  y="75"
                  width="14"
                  height="5"
                  rx="2.5"
                  fill="#E0E7FF"
                  opacity="0.9"
                />

                {/* Cardholder info lines */}
                <rect
                  x="32"
                  y="88"
                  width="50"
                  height="4"
                  rx="2"
                  fill="#C7D2FE"
                  opacity="0.8"
                />
                <rect
                  x="32"
                  y="96"
                  width="30"
                  height="4"
                  rx="2"
                  fill="#C7D2FE"
                  opacity="0.6"
                />

                {/* CVV area on right */}
                <rect
                  x="115"
                  y="48"
                  width="18"
                  height="6"
                  rx="3"
                  fill="#C7D2FE"
                  opacity="0.8"
                />
              </g>

              {/* Alert Triangle */}
              <g filter="url(#softShadow)">
                {/* Triangle base */}
                <path
                  d="M 130 55 L 165 110 L 95 110 Z"
                  fill="url(#triangleGrad)"
                />

                {/* Glossy overlay on triangle */}
                <path
                  d="M 130 55 L 165 110 L 95 110 Z"
                  fill="url(#gloss)"
                  opacity="0.5"
                />

                {/* Exclamation mark */}
                <rect
                  x="127"
                  y="72"
                  width="6"
                  height="20"
                  rx="3"
                  fill="white"
                />
                <circle cx="130" cy="99" r="4" fill="white" />
              </g>
            </svg>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 animate-pulse">
            Payment Failed !
          </h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Thank you for your purchase attempt. We were unable to process your
            payment. Please check your payment details and try again.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm font-bold">
              Order Number:
            </span>
            <span className="text-gray-900 font-bold text-sm">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm font-bold">
              Order Total:
            </span>
            <span className="text-gray-900 font-bold text-base">₹{amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm font-bold">Error Code:</span>
            <span className="text-red-600 font-bold text-sm">{errorCode}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRetryPayment}
            className="flex-1 cursor-pointer bg-white text-gray-900 px-5 py-3 rounded-sm font-semibold border-2 border-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => navigate("/account/orders")}
            className="flex-1 bg-black text-white cursor-pointer px-5 py-3 rounded-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Package className="w-4 h-4" />
            View Order Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailed;
