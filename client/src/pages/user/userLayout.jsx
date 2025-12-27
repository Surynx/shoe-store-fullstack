import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import ToasterDark from "../../components/user/Toaster";

function UserLayout() {

  let { pathname } = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <main className="flex-1 pb-6">
        <div className="relative">
          <ToasterDark/>
        </div>
        <div
          className={
            pathname == "/" || pathname == "/shop" || pathname == "/cart" || pathname == "/wishlist"  ? "mt-0 mb-0" : "mt-15 mb-10"
          }
        >
          <Outlet/>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;
