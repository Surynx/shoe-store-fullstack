import { span } from "framer-motion/client";
import { Heart, Timer } from "lucide-react";
import { use, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductDetail({ data }) {

  const nav=useNavigate();

  const productDoc = data?.data?.productDoc;
  const variant_array = data?.data?.variant_array || [];

  const [activeVariant, setActiveVariant] = useState(variant_array[0]);

  const sizes=["UK 3","UK 4","UK 5","UK 6","UK 7"]

  if(!productDoc?.status) {
    nav("/shop");
  }

  return (
    <div className="w-100 ml-10">
      <h1 className="text-lg font-sans mb-1">{productDoc?.name}</h1>
      <p className="text-sm text-gray-600">{productDoc?.gender}'s Shoes</p>

      <div className="mt-3 flex gap-2">
        <p className="text-xl font-sans">{ (activeVariant?.sales_price) ? `MRP: ₹${activeVariant?.sales_price}` : <span className="text-sm font-semibold text-gray-500">Details Unavailabe.</span>}</p>
        {activeVariant?.original_price && (
          <div className="flex items-center font-sans gap-3 mt-1">
            <p className="text-gray-500 line-through text-md">
              ₹{activeVariant?.original_price}
            </p>

            <p className="text-red-600 text-sm">
              {activeVariant?.discount}% off
            </p>
          </div>
          
        )}
      </div>
      {activeVariant?.stock == 0 ? <p className="flex mt-4 text-red-600 gap-1"><Timer size={20}/>Sold out</p> : null}

      <h3 className="mt-6 mb-2 font-semibold">Select Size</h3>

      <div className="grid grid-cols-3 sm:grid-cols-2 gap-3">
        {(activeVariant?.size) ? variant_array.map((variant) => (
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
        )) : <span className="text-sm font-light text-gray-400">currently unavailabe.</span>}
      </div>
      <button className="w-full mt-6 py-3 bg-black text-white rounded-3xl hover:bg-gray-900">
        Add to Bag
      </button>
      <button className="w-full flex items-center justify-center mt-5 py-3 gap-1 border text-black rounded-3xl hover:bg-gray-100">
        Favourite <Heart size={20} />
      </button>

      <div className="mt-6 text-sm text-gray-700 leading-relaxed">
        {productDoc?.description}
      </div>

      <div className="mt-8 border-t pt-6">
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
