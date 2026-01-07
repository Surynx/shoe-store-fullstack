import { Truck, Headphones, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import LatestProducts from "../../components/user/LatestProducts";
import BrandShowcase from "../../components/user/BrandShowcase";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDisplayBanner } from "../../Services/user.api";
import Loading from "../../components/user/Loading";

export default function HomePage() {

  const nav = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);

  const { data,isLoading } = useQuery({

    queryKey:["display-banner"],
    queryFn:getDisplayBanner

  });
  
  const banners = data?.data?.bannerDocs || [];

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);

  }, [data]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <section className="w-full h-[86vh] relative overflow-hidden group">
        <div className="relative w-full h-full">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={banner?.image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-4 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-center">
              {banners[currentSlide]?.title}
            </h1>
            <p className="text-sm md:text-base font-bold text-gray-200 mb-6 text-center">
              {banners[currentSlide]?.sub_title}
            </p>
            <button 
              className="px-8 py-3 bg-black text-white rounded-full text-base font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              onClick={() => nav("/shop")}
            >
              Shop
            </button>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronLeft className="w-8 h-8" strokeWidth={3} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronRight className="w-8 h-8" strokeWidth={3} />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-10"
                  : "bg-white/60 hover:bg-white/80 w-3"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="">
        <LatestProducts/>
      </section>

      <section className="flex items-center justify-center">
        <BrandShowcase/>
      </section>

      <section className="px-20 py-15 text-center">
        <h2 className="text-2xl font-serif text-black mb-8 text-center">
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