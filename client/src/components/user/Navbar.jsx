import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, User, ShoppingBag } from "lucide-react";
import { getCartCount } from "../../Services/user.api";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const nav = useNavigate();

  const { data } = useQuery({
    queryKey: ["cart-count"],
    queryFn: getCartCount,
  });

  const count = data?.data?.count || 0;

  return (
    <header className="">
      <div className="bg-gray-900 text-white text-xs text-center py-2">
        <span className="ml-2 text-gray-300 animate-pulse">
          SIGN UP TO GET A 15% DISCOUNT NEWSLETTER
        </span>
      </div>
      <nav className="flex items-center justify-between px-8 py-3 bg-white shadow-sm">
        <Link to="/" className=" text-2xl font-bold">
          COMET<span className="">⚡️</span>
        </Link>

        <div className="flex gap-8 text-gray-700 ml-40">
          <NavLink to="/" className="hover:text-black" end>
            Home
          </NavLink>
          <NavLink to="/about" className="hover:text-black">
            About
          </NavLink>
          <NavLink to="/shop" className="hover:text-black">
            Shop
          </NavLink>
          <NavLink to="/contact" className="hover:text-black">
            Contact
          </NavLink>
        </div>

        <div className="flex items-center gap-4 text-gray-700">
          <div className="relative w-36">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1 text-sm rounded-full border border-gray-300 outline-none"
            />
          </div>
          <Heart className="cursor-pointer hover:text-black" />
          <User
            className="cursor-pointer hover:text-black"
            onClick={() =>
              localStorage.getItem("userToken")
                ? nav("/account/profile")
                : nav("/login")
            }
          />
          <div className="relative">
          <ShoppingBag
            className="cursor-pointer hover:text-black"
            onClick={() => nav("/cart")}
          />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-xs px-1.5  rounded-full">
              {(localStorage.getItem("userToken")) ? count : null}
            </span>
          )}
          </div>
        </div>
      </nav>
    </header>
  );
}
