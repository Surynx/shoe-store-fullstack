import React from "react";
import { FaEdit, FaTrash, FaTag, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ProductTable({ products = [] }) {
  const nav = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <table className="w-full text-sm font-medium text-gray-700">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="py-3 px-5 text-left">Product</th>
            <th className="py-3 px-5 text-left">Category</th>
            <th className="py-3 px-5 text-left">Brand</th>
            <th className="py-3 px-5 text-left">Stock</th>
            <th className="py-3 px-5 text-left">Status</th>
            <th className="py-3 px-5 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((prod) => (
              <tr
                key={prod._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-all"
              >
            
                <td className="py-4 px-5 flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 rounded-md object-cover shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{prod.name}</p>
                    {/* {prod.discount > 0 && (
                      <span className="flex items-center text-green-600 text-xs mt-1">
                        <FaTag className="mr-1 text-sm" /> {prod.discount}% off
                      </span>
                    )} */}
                  </div>
                </td>

              
                <td className="py-4 px-5">{prod.category}</td>

               
                <td className="py-4 px-5">{prod.brand}</td>

               
                <td className="py-4 px-5">{prod.stock}</td>

                
                <td className="py-4 px-5">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      prod.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {prod.stock > 0 ? "Available" : "Out of Stock"}
                  </span>
                </td>

                <td className="py-4 px-5 flex justify-center gap-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-lg"
                    title="Edit Product"
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="text-red-600 hover:text-red-800 text-lg"
                    onClick={() => console.log("Delete", prod._id)}
                    title="Delete Product"
                  >
                    <FaTrash />
                  </button>

                  <button
                    className="text-green-600 hover:text-green-800 text-lg"
                    onClick={() => console.log("Apply Offer", prod._id)}
                    title="Apply Offer"
                  >
                    <FaTag />
                  </button>

                  <button
                    className="text-purple-600 hover:text-purple-800 text-lg"
                    onClick={() => nav(`/admin/product/${prod._id}/add-variant`)}
                    title="Add Variant"
                  >
                    <FaPlus />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center py-10 text-gray-400 italic text-sm"
              >
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
