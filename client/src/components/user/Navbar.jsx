import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, User, ShoppingBag, LogOut, Settings, Package } from "lucide-react";
import { getCartCount } from "../../Services/user.api";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {

  const nav = useNavigate();

  const [userName, setUserName] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("userToken");

  const { data } = useQuery({

    queryKey: ["navbar-info"],
    queryFn: getCartCount,
    refetchInterval: 3000,
    enabled: Boolean(localStorage.getItem("userToken"))
  });

  useEffect(() => {
    
    setUserName(data?.data?.username);

  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const count = data?.data?.count || 0;

  const handleLogout = () => {

    localStorage.removeItem("userToken");
    setShowDropdown(false);
    nav("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-300">
      
      <div className="bg-gray-200 text-center py-1 px-4">
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

      
      <div className="bg-white border-b border-gray-300 py-0.5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-end gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                <p className="text-xs text-gray-600">
                  Hi, <span className="font-semibold text-gray-900">{userName || "Member"}</span>
                </p>
                
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  aria-label="Account"
                >
                <User className="w-4 h-4 text-gray-700" />
                </button>

                
                {showDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        nav("/account/profile");
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-1 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      My Account
                    </button>
                    <button
                      onClick={() => {
                        nav("/account/orders");
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </button>
                    <button
                      onClick={() => {
                        nav("/account/edit");
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-1 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-1 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => nav("/login")}
                  className="text-xs text-gray-700 hover:text-black font-medium transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => nav("/signup")}
                  className="text-xs text-gray-700 hover:text-black font-medium transition-colors cursor-pointer"
                >
                  Join Us
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
          
            <Link to="/" className="">
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

           
            <div className="hidden lg:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium py-5 transition-colors${
                    isActive
                      ? "text-black"
                      : "text-gray-700 hover:text-black"
                  }`
                }
              >
                Home
              </NavLink>
              
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `text-sm font-medium py-5 transition-colors${
                    isActive
                      ? "text-black"
                      : "text-gray-700 hover:text-black"
                  }`
                }
              >
                Collections
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-sm font-medium py-5 transition-colors${
                    isActive
                      ? "text-black"
                      : "text-gray-700 hover:text-black"
                  }`
                }
              >
                Support
              </NavLink>
            </div>

    
            <div className="flex items-center space-x-2">
          
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 hover:bg-gray-200 transition-colors">
                <Search className="w-4 h-4 text-gray-600 mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent outline-none text-xs w-28 lg:w-32 placeholder-gray-500"
                />
              </div>

            
              <button
                className="md:hidden p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              
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