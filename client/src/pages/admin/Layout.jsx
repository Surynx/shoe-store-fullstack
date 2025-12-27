import Sidebar from "../../components/admin/Sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

function Layout() {
  return (
    <div className="flex">
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="dark"
        toastStyle={{
          fontSize: "14px",
          padding: "8x 10px",
          borderRadius: "6px",
          minHeight: "unset",
          boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
        }}
      />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            background: "#3b2f2f",
            color: "white",
            border: "1px solid #e5e7eb",
            padding: "6px 10px",
            fontSize: "14px",
            borderRadius: "6px",
            minWidth: "unset",
            boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ecfdf5",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fef2f2",
            },
          },
        }}
      />
      <Sidebar />
      <div className="ml-54 w-full min-h-screen bg-gray-100 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
