import {  Folder, Home, LogOut, Package, TagIcon, User } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';

function Sidebar() {

    const nav=useNavigate();

    const menuItems = [{
        name: "Dashboard", icon: <Home color='black' size={20} />, path: "/admin/dashboard"
    }, {
        name: "Users", icon: <User color='black' size={20} />, path: "/admin/users"
    },{
        name:"Category" , icon: <Folder color='black' size={20}/> , path:"/admin/category"
    },{
        name:"Brand", icon:<TagIcon color='black' size={20}/>, path:"/admin/brand"
    },{
        name:"Product", icon:<Package color='black' size={20}/>,path:"/admin/product"
    }]

    const logout=()=>{
        toast.success("Logout",{iconTheme: {
                primary: "#000", 
                secondary: "#fff", 
            }})
        localStorage.removeItem("adminToken");
        nav("/admin/login");
    }

    return (
        <div className="fixed left-0 top-0 h-screen w-54 bg-white border-r border-gray-300 flex flex-col justify-between">
            <div>
                <div className="p-6 border-b border-gray-300">
                    <h1 className="text-xl font-bold text-black">Buy<span className='text-orange-600'>N</span>Go</h1>
                    <div className="flex items-center gap-2 text-gray-500 font-bold text-xs">
                        <span>Admin Dashboard</span>
                    </div>
                </div>
                <nav className="flex-1 p-4">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-lg mb-1 font-bold text-sm transition-all ${isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-500"
                                }`
                            }
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-100">
                <button className="flex items-center gap-3 text-red-600 hover:bg-red-50 w-full px-4 py-2 rounded-lg font-medium transition-all"
                onClick={logout}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Sidebar