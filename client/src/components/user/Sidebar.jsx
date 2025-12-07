import { NavLink, replace, useNavigate } from "react-router-dom";
import { User, MapPin, Package, LogOut, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function Sidebar({ name, email,avatar }) {
  const nav = useNavigate();

  const handleLogout = () => {
    toast.success("Logout");
    localStorage.removeItem("userToken");
    nav("/", { replace: true });
  };


  return (
  <div className="p-6">
   <div className="flex flex-col items-center mb-6">

    {!avatar ? 
    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
       <User className="text-gray-400 w-12 h-12" /> 
    </div>
    :
    <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border border-gray-200">
      <img
        src={avatar}
        alt="User Avatar"
        className="w-full h-full object-cover"
      />
    </div>
    }

    <h2 className="font-semibold text-lg">{name}</h2>
    <p className="text-xs font-sans text-gray-500">{email}</p>
    </div>

      <nav className="space-y-1 text-sm">
        <NavLink
          to="/account/profile"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md transition ${
              isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
            }`
          }
        >
          <User className="w-4 h-4" />
          Personal Information
        </NavLink>

        <NavLink
          to="/account/edit"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md transition ${
              isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
            }`
          }
        >
          <Edit className="w-4 h-4" />
          Update Information
        </NavLink>

        <NavLink
          to="/account/address"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md transition ${
              isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
            }`
          }
        >
          <MapPin className="w-4 h-4" />
          Addresses
        </NavLink>

        <NavLink
          to="/account/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md transition ${
              isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
            }`
          }
        >
          <Package className="w-4 h-4" />
          Order History
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md w-full mt-4 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>
    </div>
  );
}
