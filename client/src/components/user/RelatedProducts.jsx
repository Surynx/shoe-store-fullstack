import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function RelatedProducts({ data }) {
  const productsList = data?.data?.relatedProducts || [];
  const active_products = productsList.filter((product) => product.status == true);
  const nav = useNavigate();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [active_products]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  if (active_products.length === 0) return null;

  return (
    <div className="py-10 px-2">
      <hr className="text-gray-200" />
      <div className="relative px-5 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">You Might Also Like</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                canScrollLeft
                  ? 'bg-gray-200 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                canScrollRight
                  ? 'bg-gray-200 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {active_products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer flex-none w-[85%] sm:w-[45%] lg:w-[31%]"
              onClick={() => nav(`/shop/product/${product._id}`)}
            >
              <div className="relative bg-gray-100 mb-3 overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={product.productImages[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="flex flex-col px-1">
                <div className="text-black font-bold text-sm mb-1 line-clamp-2">
                  {product.name}
                </div>
                <div className="text-gray-500 text-sm font-sans mb-1">
                  {product.gender}'s Shoes
                </div>
                <div className="text-black flex items-center gap-1 text-sm font-md">
                  {product?.total_stock != 0 ? (
                    `MRP : ₹${product?.variant_array[0]?.sales_price}.00`
                  ) : (
                    <span className="text-red-600 font-sans">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}