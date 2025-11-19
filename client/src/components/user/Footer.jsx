export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-300 mt-10 py-10 px-8 text-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-700 text-sm">
        <div>
          <h3 className="font-bold mb-3 text-black">BROWSE AND COMFORT</h3>
          <ul className="space-y-2">
            <li>SLICK Delivery</li>
            <li>SLICK Delivery Plus</li>
            <li>Fit & Sizing</li>
            <li>Free Returns</li>
            <li>Track My Order</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3 text-black">HELP</h3>
          <ul className="space-y-2">
            <li>Contact Us</li>
            <li>Live Chat</li>
            <li>FAQs</li>
            <li>Shipping</li>
            <li>Returns</li>
          </ul>
        </div>

     
        <div>
          <h3 className="font-bold mb-3 text-black">NEWSLETTER</h3>
          <ul className="space-y-2">
            <li>Be the first to hear about Slick’s latest styles</li>
            <li className="text-black font-medium cursor-pointer hover:underline">
              Sign Up Now
            </li>
          </ul>
        </div>

    
        <div>
          <h3 className="font-bold mb-3 text-black">FOLLOW US</h3>
          <div className="flex gap-4 text-gray-600">
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-youtube"></i>
          </div>
        </div>
      </div>
      <hr className="border-gray-200 mt-5"/>
      <p className="text-center text-gray-500 text-xs mt-3 font-semibold">
        © 2024 Slick. All rights reserved.
      </p>
    </footer>
  );
}
