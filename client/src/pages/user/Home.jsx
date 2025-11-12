import React, { useEffect, useState } from "react";
// import { getAllCategories } from "../Services/userApi"; 
import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

function Home() {
  // const [categories, setCategories] = useState([]);
  // const [selectedColor, setSelectedColor] = useState("red");

  // const colorImages = {
  //   red: "/images/shoes-red.png",
  //   blue: "/images/shoes-blue.png",
  //   green: "/images/shoes-green.png",
  // };

  // // useEffect(() => {
  // //   const fetchCategories = async () => {
  // //     try {
  // //       const res = await getAllCategories();
  // //       setCategories(res.data.categories || []);
  // //     } catch (error) {
  // //       console.log(error);
  // //     }
  // //   };
  // //   fetchCategories();
  // // }, []);

  // const brands = [
  //   { name: "Nike", logo: "/images/nike-logo.png" },
  //   { name: "Adidas", logo: "/images/adidas-logo.png" },
  //   { name: "Puma", logo: "/images/puma-logo.png" },
  //   { name: "Reebok", logo: "/images/reebok-logo.png" },
  // ];

  // const products = [
  //   { name: "Air Zoom Pegasus", img: "/images/shoe1.png", price: "₹5,499" },
  //   { name: "Ultraboost 21", img: "/images/shoe2.png", price: "₹8,999" },
  //   { name: "Puma Velocity Nitro", img: "/images/shoe3.png", price: "₹6,299" },
  // ];

  // return (
  //   <div className="px-6 sm:px-10">
  //     {/* Hero Section */}
  //     <section className="text-center py-16">
  //       <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
  //         Step Into Style
  //       </h1>
  //       <p className="text-gray-600 mt-4 text-lg">
  //         Discover exclusive collections and the latest sneaker trends.
  //       </p>
  //       <Link
  //         to="/shop"
  //         className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
  //       >
  //         Shop Now
  //       </Link>
  //     </section>

  //     {/* Category Section */}
  //     <section className="py-12">
  //       <h2 className="text-2xl font-semibold mb-6 text-gray-800">Shop by Category</h2>
  //       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
  //         {categories.map((cat) => (
  //           <motion.div
  //             key={cat._id}
  //             className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 text-center"
  //             whileHover={{ scale: 1.05 }}
  //           >
  //             <h3 className="font-semibold text-lg text-gray-700">{cat.name}</h3>
  //             <p className="text-gray-500 text-sm mt-1">{cat.description}</p>
  //           </motion.div>
  //         ))}
  //       </div>
  //     </section>

  //     {/* Brand Section */}
  //     <section className="py-12 bg-gray-100 rounded-xl">
  //       <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Our Brands</h2>
  //       <div className="flex flex-wrap justify-center gap-10">
  //         {brands.map((brand, i) => (
  //           <motion.div
  //             key={i}
  //             whileHover={{ scale: 1.1 }}
  //             className="bg-white shadow-md rounded-xl p-4 flex items-center justify-center w-32 h-24"
  //           >
  //             <img src={brand.logo} alt={brand.name} className="max-h-12 object-contain" />
  //           </motion.div>
  //         ))}
  //       </div>
  //     </section>

  //     {/* Products Section */}
  //     <section className="py-12">
  //       <h2 className="text-2xl font-semibold mb-6 text-gray-800">Featured Products</h2>
  //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  //         {products.map((product, i) => (
  //           <motion.div
  //             key={i}
  //             whileHover={{ scale: 1.05 }}
  //             className="bg-white shadow rounded-2xl p-5 text-center"
  //           >
  //             <img
  //               src={product.img}
  //               alt={product.name}
  //               className="w-48 h-48 object-contain mx-auto"
  //             />
  //             <h3 className="mt-4 font-semibold text-lg">{product.name}</h3>
  //             <p className="text-gray-600 mt-1">{product.price}</p>
  //           </motion.div>
  //         ))}
  //       </div>
  //     </section>

  //     {/* Interactive Demo Section */}
  //     <section className="py-16 text-center">
  //       <h2 className="text-2xl font-semibold text-gray-800 mb-6">Try Our Color Palette Demo</h2>
  //       <p className="text-gray-500 mb-6">Switch colors and watch the shoe change instantly!</p>
  //       <div className="flex justify-center gap-6 mb-8">
  //         {Object.keys(colorImages).map((color) => (
  //           <label key={color} className="flex items-center gap-2 cursor-pointer">
  //             <input
  //               type="radio"
  //               name="color"
  //               checked={selectedColor === color}
  //               onChange={() => setSelectedColor(color)}
  //               className="accent-current"
  //             />
  //             <span className="capitalize text-gray-700">{color}</span>
  //           </label>
  //         ))}
  //       </div>
  //       <motion.img
  //         src={colorImages[selectedColor]}
  //         alt={selectedColor}
  //         key={selectedColor}
  //         initial={{ opacity: 0, y: 30 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.4 }}
  //         className="w-72 sm:w-96 mx-auto"
  //       />
  //     </section>
  //   </div>
  // );
}

export default Home;
