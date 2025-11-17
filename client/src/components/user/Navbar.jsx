import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, User, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const nav = useNavigate();

  return (
    <header className="border-b">
      <div className="bg-black text-white text-sm text-center py-2">
        SIGN UP TO GET A 15% DISCOUNT NEWSLETTER
      </div>
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <Link to="/" className="ml-4 text-2xl font-bold">
          Buy<span className="text-orange-600">N</span>Go
        </Link>

        <div className="ml-15 flex gap-8 text-gray-700">
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
          <Search className="cursor-pointer hover:text-black" />
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
