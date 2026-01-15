import { Search, Package } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../../Services/user.api";
import { useNavigate } from "react-router-dom";

function NavbarSearch() {

  const { register, watch } = useForm({
    defaultValues: {
      search: ""
    }
  });

  const nav = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const searchValue = watch("search");

  const { data, isLoading } = useQuery({
    queryKey: ["products", searchValue],
    queryFn: () => searchProducts(searchValue),
    enabled: searchValue.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchValue.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchValue]);

  const handleProductClick = (product) => {

    nav(`/product/${product._id}`);
  };

  const filteredProducts = data?.data?.productDoc || [];

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-3 py-1.5 hover:bg-gray-200 transition-colors">
        <Search className="w-4 h-4 text-gray-600 mr-2" />
        <input
          type="text"
          placeholder="Search products..."
          {...register("search")}
          className="bg-transparent outline-none text-xs w-28 lg:w-48 placeholder-gray-500"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="p-2">
              <div className="flex items-center gap-2 text-gray-700 text-xs font-medium mb-2 px-2">
                <Package className="w-4 h-4" />
                <span>Products ({filteredProducts.length})</span>
              </div>
              {filteredProducts.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <img 
                    src={product.productImages[0]} 
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    </div>
                    <p className="text-xs text-gray-500">{product?.category_id?.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{product.type}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No products found</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for something else</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NavbarSearch;