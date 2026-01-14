import { Heart, Tag, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addToCart, addToFavourite } from "../../Services/user.api";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductDetail({ data, setActiveVariant, activeVariant, offer, bestOffer }) {

  const nav = useNavigate();

  const QueryClient = useQueryClient();

  const productDoc = data?.data?.productDoc;

  const variant_array = data?.data?.variant_array || [];

  const offer_price= bestOffer && bestOffer.type == "percentage" ? (activeVariant.sales_price*bestOffer.value)/100 : bestOffer?.value || 0;

  if (!productDoc?.status) {
    nav("/shop");
  }

  const discount_price = offer?.discount_price || 0;

  const handleAddtoCart = async () => {

    if (localStorage.getItem("userToken")) {

      try {

        const res= await addToCart({ product_id: productDoc._id,variant_id: activeVariant._id });

        if (res.data.success) {
          toast.success(
            `${productDoc.name} of size ${activeVariant.size} Added To Bag Successfully!`
          );
          nav("/cart");
          QueryClient.invalidateQueries("cart-count");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      nav("/signup");
      toast("Please login to Add Product To Bag");
    }
  };
  
  const handleAddtoFavourite = async () => {

    if (localStorage.getItem("userToken")) {

      try {

        const res= await addToFavourite({ product_id:productDoc._id,variant_id:activeVariant._id });

        if (res.data.success) {
          toast.success(
            `${productDoc.name} of size ${activeVariant.size} Added To Favourite Successfully!`
          );
          nav("/wishlist");
        }

        
      } catch (error) {

        toast.error(error?.response?.data?.message);
      }

    }else {

      nav("/signup");
      toast("Please login to Add Product To Favourite!");
    }
  };


  return (
    <div className="w-100 ml-10">
      <h1 className="text-lg font-sans mb-1">{productDoc?.name}</h1>
      <p className="text-sm text-gray-600">{productDoc?.gender}'s {productDoc.category_id.name}</p>

      <div className="mt-3 flex gap-2">
        <p className="text-xl font-sans">
          {activeVariant?.sales_price ? (
            `MRP: ₹${activeVariant?.sales_price - offer_price}`
          ) : (
            <span className="text-sm font-semibold text-gray-500">
              Details Unavailabe.
            </span>
          )}
        </p>
        {activeVariant?.original_price && (
          <div className="flex items-center font-sans gap-3 mt-1">
            <p className="text-gray-500 line-through text-md">
              ₹{activeVariant?.original_price}
            </p>

            { bestOffer ? <span className="bg-green-100 border flex gap-1 border-green-300 text-black text-[11px] font-semibold px-2 py-0.5">
              <Tag size={18}/>{bestOffer.type === "percentage"
                ? `${bestOffer.value}% OFF`
                : `₹${bestOffer.value} FLAT OFF`}
            </span> : <p className="text-red-700">{activeVariant.discount}% off</p>}
          </div>
        )}
      </div>
      {activeVariant?.stock == 0 ? (
        <p className="flex mt-4 text-red-600 gap-1">
          <Timer size={20} />
          Out of stock
        </p>
      ) : null}

      <h3 className="mt-6 mb-2 font-semibold">Select Size</h3>

      <div className="grid grid-cols-3 sm:grid-cols-2 gap-3">
        {activeVariant?.size ? (
          variant_array.map((variant) => (
            <button
              key={variant._id}
              onClick={() => setActiveVariant(variant)}
              className={`py-2 border rounded text-sm cursor-pointer ${
                activeVariant?.size === variant?.size
                  ? "border-black font-medium"
                  : "border-gray-300"
              }`}
            >
              {variant?.size}
            </button>
          ))
        ) : (
          <span className="text-sm font-light text-gray-400">
            currently unavailabe.
          </span>
        )}
      </div>
      <button
        className="w-full mt-6 py-3 bg-black text-white rounded-3xl hover:bg-gray-900 cursor-pointer"
        onClick={handleAddtoCart}
      >
        Add to Bag
      </button>
      <button className="w-full flex items-center justify-center mt-5 py-3 gap-1 border text-black rounded-3xl hover:bg-gray-100 cursor-pointer"
      onClick={handleAddtoFavourite}
      >
        Add Favourite <Heart size={20} />
      </button>

      <div className="mt-6 text-sm text-gray-700 leading-relaxed">
        {productDoc?.description}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-300">
        <h3 className="text-lg font-semibold mb-3">Delivery & Returns</h3>

        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-2">
          <li>Free delivery for Nike Members within 2–4 business days.</li>
          <li>
            Express delivery available at an additional cost (1–2 business
            days).
          </li>
          <li>Cash on Delivery (COD) available on select pin codes.</li>
          <li>30-day return policy for unworn items in original condition.</li>
        </ul>
      </div>
    </div>
  );
}
