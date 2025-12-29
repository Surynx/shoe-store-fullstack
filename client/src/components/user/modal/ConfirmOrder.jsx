import React, { useState } from "react";
import { X,AlertCircle } from "lucide-react";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  orderDetails,
  placeOrder
}) => {


  if (!isOpen) return null;

  const { selectedPayment,subtotal,discount,appliedCoupon=null,shipping_charge,tax,total,couponDiscount } = orderDetails;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Confirm Your Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Please review your order details carefully before confirming.
            </p>
          </div>

          {/* Price Breakdown */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Price Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Coupon ({appliedCoupon?.code})
                  </span>
                  <span className="text-green-600">-₹{couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{shipping_charge}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (18%)</span>
                <span className="text-gray-900">₹{tax.toLocaleString("en-IN")}</span>
              </div>

              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-sm cursor-pointer text-sm font-sans hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={placeOrder}
            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-sm cursor-pointer text-sm font-sans hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {`Continue with ${selectedPayment}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
