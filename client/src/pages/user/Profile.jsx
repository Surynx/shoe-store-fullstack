import { Outlet } from "react-router-dom";
import Sidebar from "../../components/user/Sidebar";


export default function Profile() {
  return (
    <div className="flex my-12">

      <div className="w-1/4 lg:w-1/5 bg-white border-1 ml-3.5 rounded-2xl">
        <Sidebar />
      </div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}