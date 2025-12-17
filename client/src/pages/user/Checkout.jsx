import React, { useEffect, useState } from "react";
import { Plus, Check, Truck, Download, X, Edit, Tag, Gift } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewAddress,
  getCheckoutInfo,
  placeNewOrder,
  updateAddress,
  validateCartItems,
  validateCoupon,
} from "../../Services/user.api";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/admin/ErrorMessage";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  useEffect(() => {
    const validateCart = async () => {
      try {
        const res = await validateCartItems();
      } catch (err) {
        console.error(err);
        toast.error(err.response.data.message);
        nav("/cart", { replace: true });
      }
    };

    validateCart();
  }, []);

  const nav = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editAddress_id, setEditAddress_id] = useState(null);

  const { reset, handleSubmit,register,formState: { errors } } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["checkout-data"],
    queryFn: getCheckoutInfo,
    keepPreviousData: true,
  });

  const QueryClient = useQueryClient();

  const addresses = data?.data?.addressDocs || [];
  const cartItems = data?.data?.cartItemsWithOffers || [];
  const coupons = data?.data?.coupon || [];

  useEffect(() => {

    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]._id);
    }
  }, [addresses]);

  const [selectedPayment, setSelectedPayment] = useState("card");

  const [couponCode, setCouponCode] = useState("");

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = cartItems.reduce((acc, curr) => {
    acc += curr.original_price * curr.quantity;
    return acc;
  }, 0);

  const sales_price_total = cartItems.reduce((acc, curr) => {
    acc += curr.sales_price * curr.quantity;
    return acc;
  }, 0);

  const offerDiscount = cartItems.reduce((acc, curr) => {
    if (curr.bestOffer) {
      acc += curr.bestOffer.discount_price * curr.quantity;
    }
    return acc;
  }, 0);

  const discount = subtotal - sales_price_total + offerDiscount;

  const shipping = selectedPayment == "cod" ? "₹ 7" : "Free";
  const shipping_charge = selectedPayment == "cod" ? 7 : 0;

  const taxableAmount = cartItems.reduce((acc, curr) => {
    acc += curr.bestOffer
      ? curr.sales_price * curr.quantity - curr.bestOffer.discount_price
      : curr.sales_price * curr.quantity;

    return acc;
  }, 0);

  const tax = Math.round(taxableAmount * 0.18);

  const total = subtotal - discount - couponDiscount + shipping_charge + tax;

  const handleEditAddress = (addressId) => {
    setIsEditing(true);
    setShowAddressForm(true);
    setEditAddress_id(addressId);

    let editAddress = addresses.find((address) => address._id == addressId);
    reset(editAddress);
  };

  const handleAddNewAddress = () => {
    reset({
      type: "",
    });

    setIsEditing(false);
    setShowAddressForm(true);
  };

  const handleCloseForm = () => {
    setShowAddressForm(false);
    setIsEditing(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      let res;

      if (isEditing) {
        res = await updateAddress(data, editAddress_id);
      } else {
        res = await addNewAddress(data);
      }

      if (res && res.data.success) {
        toast.success(res.data.message);
        setShowAddressForm(false);
        setIsEditing(false);
        QueryClient.invalidateQueries("checkout-data");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went Wrong!");
    }
  };

  const handleApplyCoupon = async(data) => {
    
    try{
    const res= await validateCoupon(data);

    if(res?.data?.success) {

      const coupon= res.data.coupon[0]

      toast.success(res.data.message);

      setAppliedCoupon(coupon);

      const discount_value = coupon.type == "flat" ? coupon.value : (total*coupon.value) / 100 ;

      setCouponDiscount(discount_value);
    }
  }catch(error) {

    toast.error(error.response.data.message);
  }
    
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponDiscount(0);
    toast.success("Coupon removed");
  };

  const handlePlaceOrder = async () => {
    try {

      let res;

      if(appliedCoupon) {

        res = await placeNewOrder({ selectedAddress, selectedPayment, appliedCoupon });

      }else {

        res = await placeNewOrder({ selectedAddress, selectedPayment });
      }

      if (res && res.data.success) {

        const orderId = res.data.orderId;
        nav(`/order/success/${orderId}`, { state: total });

      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-md p-5 border border-gray-400">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Delivery Address
                  </h2>
                </div>
              </div>

              {!showAddressForm ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => setSelectedAddress(address._id)}
                      className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                        selectedAddress === address._id
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selectedAddress === address._id
                                ? "border-gray-900 bg-gray-900"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAddress === address._id && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {address.type}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 mb-0.5">
                            {address.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {address.line1}
                          </p>
                          {address.line2 && (
                            <p className="text-xs text-gray-600">
                              {address.line2}
                            </p>
                          )}
                          <p className="text-xs text-gray-600">
                            {address.city}, {address.state} {address.pin_code}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            +91 {address.phone}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address._id);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {addresses.length === 0 && (
                    <p className="text-sm text-gray-400">No address added!</p>
                  )}

                  <button
                    onClick={handleAddNewAddress}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center gap-2 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-all cursor-pointer"
                  >
                    <Plus size={18} />
                    <span className="text-sm font-medium">Add New Address</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-800">
                      {isEditing ? "Edit Address" : "Add New Address"}
                    </h3>
                    <button
                      onClick={handleCloseForm}
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X size={18} className="text-gray-600" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address Type
                    </label>
                    <select
                      {...register("type", {
                        required: "Please select address type",
                      })}
                      className="w-full px-3 py-2 border outline-none text-sm"
                    >
                      <option value="">Select</option>
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                    <ErrorMessage elem={errors.type} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register("name", {
                          required: "Full name is required",
                          minLength: {
                            value: 3,
                            message: "Name must be at least 3 chars",
                          },
                        })}
                        className="w-full px-3 py-2 border outline-none text-sm"
                        placeholder="Enter full name"
                      />
                      <ErrorMessage elem={errors.name} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[6-9]\d{9}$/,
                            message: "Enter valid 10-digit number",
                          },
                        })}
                        className="w-full px-3 py-2 border outline-none text-sm"
                        placeholder="9876543210"
                      />
                      <ErrorMessage elem={errors.phone} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      {...register("line1", {
                        required: "Address Line 1 is required",
                      })}
                      className="w-full px-3 py-2 border outline-none text-sm"
                      placeholder="House/Flat no., Street name"
                    />
                    <ErrorMessage elem={errors.line1} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      {...register("line2")}
                      className="w-full px-3 py-2 border outline-none text-sm"
                      placeholder="Landmark, Area (Optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        {...register("city", {
                          required: "City is required",
                        })}
                        className="w-full px-3 py-2 border outline-none text-sm"
                        placeholder="City"
                      />
                      <ErrorMessage elem={errors.city} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        {...register("state", {
                          required: "State is required",
                        })}
                        className="w-full px-3 py-2 border outline-none text-sm"
                        placeholder="State"
                      />
                      <ErrorMessage elem={errors.state} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        {...register("pin_code", {
                          required: "Pincode is required",
                          pattern: {
                            value: /^[1-9][0-9]{5}$/,
                            message: "Enter a valid 6-digit pincode",
                          },
                        })}
                        className="w-full px-3 py-2 border outline-none text-sm"
                        placeholder="673001"
                      />
                      <ErrorMessage elem={errors.pin_code} />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={handleCloseForm}
                      type="button"
                      className="flex-1 px-3 py-2 border text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 border text-white bg-gray-700 hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer"
                    >
                      {isEditing ? "Update Address" : "Add Address"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-white rounded-md p-5 border border-gray-400">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Items ({cartItems.length})
                </h2>
              </div>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-3 border-b last:border-b-0 border-gray-300"
                  >
                    <img
                      src={item.product_image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex gap-3 text-xs text-gray-600 mb-1.5">
                        <span>Gender: {item.gender}</span>
                        <span>Size: {item.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </span>

                        <div className="text-right">
                          <div className="flex items-center">
                            <p className="font-semibold text-lg text-black">
                              ₹{" "}
                              {item.bestOffer
                                ? (
                                    item.sales_price * item.quantity -
                                    item.bestOffer.discount_price
                                  ).toLocaleString("en-IN")
                                : item.sales_price * item.quantity}
                            </p>
                            {item.original_price && (
                              <p className="text-orange-700 line-through text-xs ml-2">
                                ₹{" "}
                                {(
                                  item.original_price * item.quantity
                                ).toLocaleString("en-IN")}
                              </p>
                            )}
                          </div>
                          {item.bestOffer && (
                            <span className="bg-red-500 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full mt-1 w-fit">
                              {item.bestOffer.type === "percentage"
                                ? `${item.bestOffer.value}% OFF`
                                : `₹${item.bestOffer.value} FLAT OFF`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-md p-5 border border-gray-400">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: "card",
                    label: "Credit/Debit Card",
                    desc: "Pay securely with your card",
                  },
                  { id: "upi", label: "UPI", desc: "Pay using UPI apps" },
                  {
                    id: "wallet",
                    label: "Wallets",
                    desc: "PayPal, Amazon Pay, and more",
                  },
                  {
                    id: "cod",
                    label: "Cash on Delivery",
                    desc: "Pay when you receive",
                  },
                ].map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === method.id
                            ? "border-gray-900 bg-gray-900"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPayment === method.id && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {method.label}
                        </p>
                        <p className="text-xs text-gray-600">{method.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-5 border shadow-sm sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-700">
                  <span>Shipping</span>
                  <span className="text-gray-700">{shipping}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-700">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>

                <div className="border-t pt-2.5 mt-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-5 pb-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Apply Coupon
                </h3>

                {!appliedCoupon ? (
                  <div>
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1 relative">
                        <Tag
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />

                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 text-sm outline-none focus:border-gray-900 transition-colors"
                          {...register("code", {
                            
                          })}                 
                        />
                      </div>

                      <button
                        onClick={handleSubmit(handleApplyCoupon)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-sm text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="p-2.5 bg-gray-50 rounded-lg">
                      <p className="text-[12px] text-gray-600 mb-1.5 font-medium flex gap-1 items-center">
                      Available Coupons:
                      </p>
                      {coupons.length > 0 ? (
                        <div className="space-y-1">
                          {coupons.map((coupon) => (
                            <p className="text-[10px] text-gray-700">
                              <span className="font-semibold">
                                {coupon.code}
                              </span>
                              {coupon.type == "flat"
                                ? ` - ₹${coupon.value} flat discount`
                                : ` - Get ${coupon.value}% off`}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-[10px] italic text-red-600 font-sans">
                            coupon unavailable for the price{" "}
                          </p>
                        </div>
                      )}
                    </div>
                    
                  </div>
                ) : (
                  <div className="border-2 border-green-500 bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {appliedCoupon.code} Applied
                          </p>
                          <p className="text-xs text-green-700">
                            You saved ₹{couponDiscount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                      >
                        <X size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer mb-4"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
