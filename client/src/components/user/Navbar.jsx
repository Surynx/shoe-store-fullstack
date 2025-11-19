import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, User, ShoppingBag, SearchIcon } from "lucide-react";

export default function Navbar() {
  const nav = useNavigate();

  return (
    <header className="">
      <div className="bg-black text-white text-xs text-center py-2">
        SIGN UP TO GET A 15% DISCOUNT NEWSLETTER
      </div>
      <nav className="flex items-center justify-between px-8 py-3 bg-white shadow-sm">
        <Link to="/" className=" text-2xl font-bold">
          XOXO<span className="text-sm"> .com</span>
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
                ? nav("/profile")
                : nav("/login")
            }
          />
          <ShoppingBag
            className="cursor-pointer hover:text-black"
            onClick={() => nav("/cart")}
          />
        </div>
      </nav>
    </header>
  );
}
