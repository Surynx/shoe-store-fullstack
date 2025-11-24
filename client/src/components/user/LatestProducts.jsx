import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { getAllLatestProducts } from "../../Services/user.api";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";


export default function Latestproducts() {

  const nav=useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["productList"],
    queryFn: getAllLatestProducts,
  });

  const productsList = data?.data?.data || [];

  const active_products= productsList.filter((product)=> product.status == true);

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
        <h2 className="text-4xl font-serif text-black mb-2 text-center">
          Latest Products
        </h2>
        <p className="text-center text-sm font-sans mb-10">
          Discover our latest arrivals, freshly added and handpicked just for you.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {active_products.map((product) => (
            <div
              key={product._id}
              className="group cursor-pointer"
              onClick={()=>nav(`/product/${product._id}`)}
            >

              <div className="relative bg-gray-100 mb-3 overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={product.productImages[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* <button
                  className="absolute top-3 right-3 p-2 bg-white rounded-full hover:opacity-80 transition-opacity"
                >
                  <Heart size={18}/>
                </button> */}
              </div>

              <div className="flex flex-col px-1">
                <div className="text-green-700 text-xs font-medium mb-1">
                  Just In
                </div>
                
                <div className="text-black font-sans text-sm mb-1 line-clamp-2">
                  {product.name}
                </div>
                
                <div className="text-black flex items-center gap-1 text-sm font-md">
                {product?.total_stock != 0 ? `MRP :  ₹${product?.variants[0]?.sales_price}.00` : <span className="text-red-600 font-sans">Out of Stock</span>} 
                </div>
              </div>
            </div>
          ))}
        </div>

        {productsList.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}