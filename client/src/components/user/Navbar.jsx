import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, User, ShoppingBag } from "lucide-react";
import { getCartCount } from "../../Services/user.api";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {

  const nav = useNavigate();

  const { data } = useQuery({
    queryKey: ["cart-count"],
    queryFn: getCartCount,
    refetchInterval: 3000,
  });

  const count = data?.data?.count || 0;

  return (
    <nav className="w-full bg-white">
      {/* Top Announcement Bar */}
      <div className="bg-gray-200 text-center py-1.5 px-4">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="animate-marquee whitespace-nowrap inline-block">
            <span className="mx-6 text-[10px] font-medium">
              Welcome to Commet — Smart Shopping Starts Here🔥
            </span>
            <span className="mx-6 text-[10px] font-medium">
              Flat 15% OFF for New Users — Join Commet Today
            </span>
            <span className="mx-6 text-[10px] font-medium">
              Fast • Secure • Smart Shopping — Only on Commet🔥
            </span>
            <span className="mx-6 text-[10px] font-medium">
              Trending Products at Unbeatable Prices
            </span>
            <span className="mx-6 text-[10px] font-medium">
              Limited Time Deals — Grab Them Now on Commet🔥
            </span>
            <span className="mx-6 text-[10px] font-medium">
              Shop More. Save More. Experience Commet
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <svg
                className="h-7 w-auto"
                viewBox="0 0 120 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="10"
                  y="28"
                  fontFamily="Arial Black, sans-serif"
                  fontSize="20"
                  fontWeight="900"
                  fill="#000"
                >
                  COMET
                </text>
              </svg>
            </Link>

            {/* Center Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium pb-5 pt-5 border-b-2 transition-colors ${
                    isActive
                      ? "border-black text-black"
                      : "border-transparent text-gray-700 hover:text-black"
                  }`
                }
              >
                Home
              </NavLink>
              
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `text-sm font-medium pb-5 pt-5 border-b-2 transition-colors ${
                    isActive
                      ? "border-black text-black"
                      : "border-transparent text-gray-700 hover:text-black"
                  }`
                }
              >
                Collections
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-sm font-medium pb-5 pt-5 border-b-2 transition-colors ${
                    isActive
                      ? "border-black text-black"
                      : "border-transparent text-gray-700 hover:text-black"
                  }`
                }
              >
                Support
              </NavLink>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Input */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 hover:bg-gray-200 transition-colors">
                <Search className="w-4 h-4 text-gray-600 mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent outline-none text-xs w-28 lg:w-32 placeholder-gray-500"
                />
              </div>

              {/* Mobile Search Button */}
              <button
                className="md:hidden p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() =>
                  localStorage.getItem("userToken")
                    ? nav("/wishlist")
                    : nav("/login")
                }
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>

              {/* Account Button */}
              <button
                onClick={() =>
                  localStorage.getItem("userToken")
                    ? nav("/account/profile")
                    : nav("/login")
                }
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => nav("/cart")}
                className="relative p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {count > 0 && localStorage.getItem("userToken") && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </nav>
  );
}