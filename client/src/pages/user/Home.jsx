import { Truck, Headphones, RotateCcw } from "lucide-react";
import LatestProducts from "../../components/user/LatestProducts";
import BrandShowcase from "../../components/user/BrandShowcase";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

  const nav=useNavigate();

  return (
    <div className="w-full">
      <section className="w-full h-[90vh] relative overflow-hidden">
        <img
          src="src/assets/Banner.jpeg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute bottom-0 w-full text-center px-4 py-10
                  bg-gradient-to-t from-black/80 to-transparent text-white"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            KICKS THAT CAN’T MISS
          </h1>

          <p className="mt-2 text-xs font-bold text-gray-200">
            Gift the perfect sneakers for their every move.
          </p>

          <button className="mt-4 px-4 py-1 bg-black text-white rounded-full text-md font-semibold hover:bg-gray-900 transition cursor-pointer"
          onClick={()=>nav("/shop")}>
            Shop
          </button>
        </div>
      </section>

      <section className="">
        <LatestProducts/>
      </section>

      <section className="flex items-center justify-center">
        <BrandShowcase/>
      </section>

      <section className="p-20 mt-2 text-center">
          <h2 className="text-2xl font-serif text-black mb-4 text-center">
            Our Sevices
          </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-2">
            <Truck className="mx-auto mb-4 w-10 h-10 text-black" />
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-xs font-bold">
              Get your orders delivered quickly and safely to your doorstep.
            </p>
          </div>
          <div className="p-2">
            <Headphones className="mx-auto mb-4 w-10 h-10 text-black" />
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-xs font-bold">
              We provide round-the-clock support to assist you anytime.
            </p>
          </div>
          <div className="p-2">
            <RotateCcw className="mx-auto mb-4 w-10 h-10 text-black" />
            <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
            <p className="text-gray-600 text-xs font-bold">
              Hassle-free return policy for a smooth shopping experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
