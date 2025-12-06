import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function OrderSuccess() {

  const nav= useNavigate();
  const {id}= useParams();

  const {state}= useLocation();

  const total_amount = state;


  return (
    <div className="mb-5 mt-10 flex items-center justify-center p-3 gap-10">
      <div className="max-w-lg w-full bg-gray-50 rounded-2xl border border-gray-300 shadow-md p-6 md:p-8">
        
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-20"></div>
            <div className="relative w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
              <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
                <circle 
                  cx="32" 
                  cy="32" 
                  r="30" 
                  stroke="#10b981" 
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="188.5"
                  strokeDashoffset="188.5"
                  className="animate-draw-circle"
                />
                <path 
                  d="M 20 32 L 28 40 L 44 24" 
                  stroke="#10b981" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"
                  strokeDasharray="40"
                  strokeDashoffset="40"
                  className="animate-draw-check"
                />
              </svg>
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes drawCircle {
            to { stroke-dashoffset: 0; }
          }
          @keyframes drawCheck {
            to { stroke-dashoffset: 0; }
          }
          .animate-scale-in {
            animation: scaleIn 0.5s ease-out;
          }
          .animate-draw-circle {
            animation: drawCircle 0.6s ease-out 0.2s forwards;
          }
          .animate-draw-check {
            animation: drawCheck 0.4s ease-out 0.8s forwards;
          }
        `}</style>

        {/* Thank You Message */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-gray-600">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
        </div>

        

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order Number:</span>
            <span className="text-sm font-semibold text-gray-800">#{id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order Total:</span>
            <span className="text-sm font-semibold text-gray-800">₹{total_amount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Estimated Delivery:</span>
            <span className="text-sm font-semibold text-gray-800">3-5 Business Days</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={()=>nav("/account/orders")}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-5 rounded-lg border border-gray-300 transition-all duration-200 hover:shadow- flex items-center justify-center gap-2 text-sm"
          >
            <Package className="w-4 h-4" />
            View Order Details
          </button>
          <button
            onClick={()=>nav("/shop")}
            className="flex-1 cursor-pointer bg-black hover:bg-gray-800 text-white font-medium py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            Continue Shopping
          </button>
        </div>

        {/* Additional Info - Removed */}
      </div>
       {/* <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 mb-8">
          <div className="flex justify-center items-center space-x-4">
            <div className="relative">
              <Package className="w-20 h-20 text-green-600" strokeWidth={1.5} />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                ✓
              </div>
            </div>
            <div className="hidden md:block">
              <svg width="120" height="40" viewBox="0 0 120 40" className="text-green-400">
                <path
                  d="M 10 20 Q 40 5, 70 20 T 110 20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                />
                <circle cx="110" cy="20" r="4" fill="currentColor">
                  <animate
                    attributeName="cx"
                    from="10"
                    to="110"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
            <ShoppingBag className="w-16 h-16 text-green-600" strokeWidth={1.5} />
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 font-medium">
              You'll receive a confirmation email shortly with your order details.
            </p>
          </div>
        </div> */}
    </div>
  );
}