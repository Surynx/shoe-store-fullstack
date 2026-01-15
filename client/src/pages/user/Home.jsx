import { Truck, Headphones, RotateCcw, ChevronLeft, ChevronRight, User, UserPen } from "lucide-react";
import { useState, useEffect } from "react";
import LatestProducts from "../../components/user/LatestProducts";
import BrandShowcase from "../../components/user/BrandShowcase";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHomeInfo } from "../../Services/user.api";
import Loading from "../../components/user/Loading";

export default function HomePage() {

  const nav = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);

  const { data,isLoading } = useQuery({

    queryKey:["home-info"],
    queryFn:getHomeInfo

  });
  
  const banners = data?.data?.bannerDocs || [];

  const userCount = data?.data?.userCount || 0;
  const productCount = data?.data?.productCount || 0;
  const brandCount = data?.data?.brandCount || 0;

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

      <section className="px-6 md:px-20 py-16 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
                Quality You Can Trust
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed text-xs font-sans">
                We carefully curate every product in our collection to ensure you receive only the finest quality. 
                Our commitment to excellence means you can shop with confidence, knowing that each item has been 
                selected with care and attention to detail.
              </p>
              <button 
                onClick={() => nav("/contact")}
                className="px-4 py-1 border-2 font-sans transition-all duration-300 cursor-pointer"
              >
                Keep in Touch
              </button>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="public/shoes.png"
                alt="Quality products" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-4 bg-black text-white mt-8 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold mb-2">{userCount}+</h3>
              <p className="text-gray-300 text-sm">Active Customers</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">{productCount}+</h3>
              <p className="text-gray-300 text-sm">Products Available</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">{brandCount}+</h3>
              <p className="text-gray-300 text-sm">Premium Brands</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-25 py-15 text-center mb-5">
         <div className="text-center mb-10">
          <h2 className="text-3xl font-sans font-semibold text-gray-900">
            Our Sevices
          </h2>
          <p className="mt-2 text-xs font-sans text-gray-500">
            Fast, secure, and reliable shopping made easy.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-2">
            <Truck className="mx-auto mb-4 w-8 h-8 text-black" />
            <h3 className="text-sm font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-xs font-bold">
              Get your orders delivered quickly and safely to your doorstep.
            </p>
          </div>
          <div className="p-2">
            <Headphones className="mx-auto mb-4 w-8 h-8 text-black" />
            <h3 className="text-sm font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-xs font-bold">
              We provide round-the-clock support to assist you anytime.
            </p>
          </div>
          <div className="p-2">
            <RotateCcw className="mx-auto mb-4 w-8 h-8 text-black" />
            <h3 className="text-sm font-semibold mb-2">Easy Returns</h3>
            <p className="text-gray-600 text-xs font-bold">
              Hassle-free return policy for a smooth shopping experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}