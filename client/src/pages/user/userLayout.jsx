import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/user/Navbar'
import Footer from '../../components/user/Footer'
import toast, { Toaster } from "react-hot-toast"

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-12 pb-6">
        <div className="relative">
          <Toaster
            position="top-center"
            containerStyle={{
              top: "120px"
            }}
          />
        </div>
        <div className="mt-0px mb-0">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default UserLayout