import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../../components/user/Navbar'
import Footer from '../../components/user/Footer'
import toast, { Toaster } from "react-hot-toast"

function UserLayout() {

  let {pathname}=useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pb-6">
        <div className="relative">
          <Toaster
            position="top-center"
            containerStyle={{
              top: "120px"
            }}
          />
        </div>
        <div className={(pathname == "/" || pathname == "/shop") ? "mt-0 mb-0" : "mt-12 mb-0"}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default UserLayout