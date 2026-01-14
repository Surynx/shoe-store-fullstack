import { useNavigate } from "react-router-dom";

export default function Footer() {


  const nav = useNavigate()

  return (
    <footer className="bg-[#131313] text-white mt-2 py-10 px-15 text-xs">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-300 text-sm">

        {/* Browse Section */}
        <div>
          <h3 className="font-bold mb-4 text-white">BROWSE AND COMFORT</h3>
          <ul className="space-y-2">
            <li>COMET Delivery</li>
            <li>COMET Delivery Plus</li>
            <li>Fit & Sizing</li>
            <li>Free Returns</li>
            <li>Track My Order</li>
          </ul>
        </div>

        {/* Help Section */}
        <div>
          <h3 className="font-bold mb-4 text-white">HELP</h3>
          <ul className="space-y-2">
            <li>Contact Us</li>
            <li>Live Chat</li>
            <li>FAQs</li>
            <li>Shipping</li>
            <li>Returns</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-bold mb-4 text-white">NEWSLETTER</h3>
          <ul className="space-y-2">
            <li>Be the first to hear about Comet’s latest styles</li>
            <li className="text-gray-200 font-medium cursor-pointer hover:text-white hover:underline" onClick={()=>nav("/signup")}>
              Sign Up Now
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-bold mb-4 text-white">FOLLOW US</h3>
          <div className="flex gap-4 text-gray-400">
            <i className="fa-brands fa-facebook hover:text-white"></i>
            <i className="fa-brands fa-twitter hover:text-white"></i>
            <i className="fa-brands fa-instagram hover:text-white"></i>
            <i className="fa-brands fa-youtube hover:text-white"></i>
          </div>
        </div>

      </div>

      <hr className="border-gray-700 mt-5"/>

      <p className="text-center text-gray-500 text-xs mt-3 font-semibold">
        © 2024 COMET. All rights reserved.
        <p className="text-xs mt-3">Designed & developed by Sooryanarayanan</p>
      </p>
    </footer>
  );
}
