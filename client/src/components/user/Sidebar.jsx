import { NavLink, replace, useNavigate } from "react-router-dom";
import { User, MapPin, Package, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function Sidebar() {

  const nav=useNavigate();

  const handleLogout = () =>{
    toast.success("Logout");
    localStorage.removeItem('userToken');
    nav("/",{replace:true});
  }

  return (
    <div className="p-6">
     
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
          <User className="text-gray-400 w-12 h-12" />
        </div>
        <h2 className="font-semibold text-lg">John Doe</h2>
        <p className="text-sm text-gray-500">john.doe@example.com</p>
      </div>

      <nav className="space-y-1 text-sm">
        <NavLink
          to="/profile"
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
          to="addresses"
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
          to="orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md transition ${
              isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
            }`
          }
        >
          <Package className="w-4 h-4" />
          Order History
        </NavLink>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md w-full mt-4 cursor-pointer">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>
    </div>
  );
}
