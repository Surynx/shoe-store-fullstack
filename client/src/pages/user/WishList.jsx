import React, { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import {
  addToCart,
  fetchWishListInfo,
  removeItemFromWishlist,
} from "../../Services/user.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/user/Breadcrumb";

function FavoritesPage() {
  const QueryClient = useQueryClient();

  const nav = useNavigate();

  const { pathname } = useLocation();

  const { data, isLoading } = useQuery({
    queryKey: ["wishlistInfo"],
    queryFn: fetchWishListInfo,
    keepPreviousData: true,
  });

  const favorites = data?.data?.wishListItemsWithOffers;

  const removeFavorite = async (id, name) => {
    const res = await removeItemFromWishlist(id);

    if (res?.data?.success) {
      toast(`${name} Removed Successfully From Favourites`);
      QueryClient.invalidateQueries("wishlistInfo");
    }
  };

  const formatPrice = (price) => {
    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  const handleAddtoCart = async (item, product_id, variant_id) => {
    try {
      const res = await addToCart({ product_id, variant_id });

      if (res.data.success) {
        toast.success(
          `${item.name} of size ${item.size} Added To Bag Successfully!`
        );

        await removeItemFromWishlist(item.id);

        nav("/cart");
        QueryClient.invalidateQueries("cart-count");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-2 mb-15">
        <Breadcrumb location={pathname}/>
      <h1 className="text-2xl font-sans mb-10 mt-10">Favourites</h1>

      {favorites?.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            No favourites yet
          </h2>
          <p className="text-gray-500">Start adding items you love!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12">
          {favorites &&
            favorites.map((item) => (
              <div key={item.id} className="group">
                <div className="relative bg-gray-50 overflow-hidden mb-4 aspect-square cursor-pointer">
                  <button
                    onClick={() => removeFavorite(item.id, item.name)}
                    className="absolute top-4 right-4 z-10 w-10 border border-gray-300 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Remove from favourites"
                  >
                    <Heart className={`w-5 h-5 hover:scale-120 fill-black`} />
                  </button>

                  <img
                    src={item.product_image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300"
                    
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="font-sans text-md leading-tight">
                    {item.name}
                  </h3>
                  <div className="text-gray-500 text-sm font-sans mb-1">
                    {item.gender}
                  </div>
                  <p className="text-amber-700 text-xs font-semibold flex items-center gap-2">
                    {item.size}{" "}
                    {item.stock <= 0 ? (
                      <p className="font-sans text-xs text-red-600">
                        Out of stock
                      </p>
                    ) : null}
                  </p>
                  <div className="flex items-center space-x-2.5">
                    <p className="font-medium text-sm">
                      MRP : {formatPrice(item.sales_price)}
                    </p>
                    {item.bestOffer && (
                      <span className="bg-red-500 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full w-fit">
                        {item.bestOffer.type === "percentage"
                          ? `${item.bestOffer.value}% OFF`
                          : `₹${item.bestOffer.value} FLAT OFF`}
                      </span>
                    )}
                  </div>

                  {!item.status ? (
                    <p className="text-red-600 text-sm">Currently Unavailabe</p>
                  ) : (
                    <button
                      className="px-6 py-2 mt-2 border border-gray-300 rounded-full text-sm font-medium text-black bg-white hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                      onClick={() =>
                        handleAddtoCart(item, item.product_id, item.variant_id)
                      }
                    >
                      Add to Bag
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
