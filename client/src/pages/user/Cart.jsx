import { Trash2, Tag, ShoppingBag, Check, Truck } from "lucide-react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { decreaseQty,fetchCartInfo,increaseQty,removeProductFromCart,validateCartItems } from "../../Services/user.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart() {
  const nav = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["cartInfo"],
    queryFn: fetchCartInfo,
    keepPreviousData: true,
  });

  const QueryClient = useQueryClient();

  const activeCartItems = data?.data?.cartItemsWithOffers || [];

  const subtotal = activeCartItems.reduce((acc, curr) => {
    acc += curr.original_price * curr.quantity;
    return acc;
  }, 0);

  const sales_price_total = activeCartItems.reduce((acc, curr) => {
    acc += curr.sales_price * curr.quantity;
    return acc;
  }, 0);

  const offerDiscount= activeCartItems.reduce((acc,curr)=> {
    if(curr.bestOffer) {
      acc+=curr.bestOffer.discount_price;
    }
    return acc;
  },0);

  const discount = subtotal - sales_price_total + offerDiscount;

  const total_amount= subtotal - discount

  const removeItem = async (id, name) => {
    const res = await removeProductFromCart(id);

    if (res?.data?.success) {
      toast(`${name} Removed Successfully From Bag`);
      QueryClient.invalidateQueries("cartInfo");
      QueryClient.invalidateQueries("cart-count");
    }
  };

  const handleIncrease = async (id) => {
    let res = await increaseQty(id);

    if (res?.data?.success) {
      QueryClient.invalidateQueries("cartInfo");
    }
  };

  const handleDecrease = async (id) => {
    try {
      let res = await decreaseQty(id);

      if (res?.data?.success) {
        QueryClient.invalidateQueries("cartInfo");
      }
    } catch (error) {
      toast.error("There should be atleast 1 quantity of a product in Bag!");
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await validateCartItems();

      if (res && res.data.success) {
        nav("/checkout");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mb-40 px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-4 h-4" />
            <h1 className="text-lg font-semibold">Bag</h1>
          </div>

          {activeCartItems?.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <button
                className="bg-gray-700  text-sm font-bold py-2 px-4 text-white mt-3 cursor-pointer"
                onClick={() => nav("/shop")}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {activeCartItems?.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex gap-6">
                    <div className="w-32 h-32 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product_image}
                        alt={item.name}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => nav(`/shop/product/${item.product_id}`)}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-md">{item.name}</h3>
                          <p className="text-gray-500 text-xs">{item.gender}</p>
                          <p className="text-gray-600 text-xs mt-1"></p>
                          <p className="text-amber-800 text-xs font-semibold">
                            Size {item.size}
                          </p>
                          <p className="text-gray-600 text-xs">
                            Type {item.type}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeItem(item.id, item.name)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {item.stock == 0 ? (
                            <p className="text-xs font-semibold text-red-600">
                              Out Of Stock
                            </p>
                          ) : (
                            <div className="flex items-center border rounded-full">
                              <button
                                onClick={() => handleDecrease(item.id)}
                                className={`p-2 rounded-l-full transition-colors ${
                                  item.quantity <= 1
                                    ? "opacity-40 cursor-not-allowed"
                                    : "hover:bg-gray-100"
                                }`}
                                aria-label="Decrease quantity"
                                disabled={item.quantity <= 1}
                              >
                                <FaMinus className="w-2 h-2" />
                              </button>
                              <span className="px-1 py-1 text-center text-xs">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleIncrease(item.id)}
                                className={`p-2 rounded-r-full transition-colors ${
                                  item.quantity + 1 > item.stock
                                    ? "opacity-40 cursor-not-allowed"
                                    : "hover:bg-gray-100"
                                }`}
                                disabled={item.quantity + 1 > item.stock}
                                aria-label="Increase quantity"
                              >
                                <FaPlus className="w-2 h-2" />
                              </button>
                            </div>
                          )}
                        </div>
                        {item.status ? (
                          <div className="flex flex-col">
                            
                            <div className="flex items-center">
                              <p className="font-semibold text-lg text-black">
                                ₹{" "}
                                {item.bestOffer ? ((item.sales_price * item.quantity) - item.bestOffer.discount_price ).toLocaleString("en-IN") : item.sales_price * item.quantity}
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
                        ) : (
                          <p className="text-sm font-sans text-red-600">
                            Currently Unavailable
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 bg-gray-50 border border-gray-200 p-4 flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg">
              <Tag className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                Free returns for Comet Members.
              </p>
              <a href="#" className="text-sm underline hover:text-gray-600">
                Learn More
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 mt-12">
          <div className="bg-white border border-gray-400 p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-6 text-gray-500 uppercase tracking-wide">
              Price Details
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-bold text-sm">
                  Price ({activeCartItems?.length} items)
                </span>
                <span className="font-medium">
                  ₹ {subtotal?.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center text-green-600 text-sm font-semibold">
                <span className="">Discount</span>
                <span className="font-medium">
                  − ₹ {discount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="border-t border-dashed pt-4 mt-4">
                <div className="flex justify-between items-center font-semibold text-md">
                  <span>Total Amount</span>
                  <span>₹ {total_amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="border-t border-dashed pt-4 mt-4">
                <p className="text-green-600 font-bold text-sm">
                  You will save ₹{discount.toLocaleString("en-IN")} on this
                  order
                </p>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-6">
              <button
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer mb-4"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
            <div className="space-y-2 text-xs text-gray-600 mt-1">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-green-600" />
                  <span>Secure checkout</span>
                </div>

                <div className="flex items-center gap-2">
                  <Check size={14} className="text-green-600" />
                  <span>Free returns within 30 days</span>
                </div>

                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-green-600" />
                  <span>Estimated delivery: 3–5 days</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
