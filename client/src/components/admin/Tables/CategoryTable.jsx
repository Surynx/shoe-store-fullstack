import { useNavigate } from "react-router-dom";
import { addOfferForCategory, deleteOffer, getAllOfferOfCategory } from "../../../Services/admin.api";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OfferModal } from "../modal/Offer";
import { FaEdit } from "react-icons/fa";


function CategoryTable({ docs, isLoading }) {

  const nav = useNavigate();

  const QueryClient= useQueryClient();

  let categories = docs?.data?.docs || [];

  const [openModal, setOpenModal] = useState(false);

  const [offerCategory, setOfferCategory] = useState(null);

  const { data }= useQuery({
    queryKey:["offer-list-category",offerCategory],
    queryFn:()=>getAllOfferOfCategory(offerCategory._id)
  });

  const handleOffer = async (category) => {

    setOfferCategory(category);
    setOpenModal(true);
  };

  const handleAddOffer = async (data) => {

    try{
    
    const res = await addOfferForCategory(data,offerCategory._id);

    if(res.data.success) {

        toast.success("Offer Applied To Category!");
        QueryClient.invalidateQueries("offer-list-category")
        setOpenModal(false);
    }

    }catch(error) {

        toast.error(error.response.data.message);
    }

  };

  const removeOffer= async (id) => {

    const res= await deleteOffer(id);

    if(res?.data?.success) {

        toast.success("Offer Removed Success");
        QueryClient.invalidateQueries("offer-list-category");
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md">
      <table className="w-full text-sm font-bold text-gray-700">
        <thead className="bg-gray-100 text-gray-600 font-medium text-xs uppercase">
          <tr>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Products</th>
            <th className="py-3 px-6 text-left">Offers</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <tr
                key={cat._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-4 px-6">
                  <div>
                    <p className="font-bold text-gray-900">{cat.name}</p>
                  </div>
                </td>

                <td className="py-4 px-6 text-red-800 text-sm font-semibold">
                  {cat.description || (
                    <span className="text-xs font-bold text-gray-400">
                      No description
                    </span>
                  )}
                </td>

                <td className="py-4 px-6 text-gray-400 text-xs">
                  {cat.total_products
                    ? `${cat.total_products} products`
                    : "No products"}
                </td>

                <td className="py-4 px-6">
                  <button
                    className="flex items-center gap-1 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => handleOffer(cat)}
                  >
                    <i className="fa-solid fa-tags"></i>
                    Offers
                  </button>
                </td>

                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      cat.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {cat.status ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="py-4 px-6 text-center flex justify-center gap-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-lg cursor-pointer"
                    onClick={() =>
                      nav(`/admin/category/edit/${cat._id}`, { state: cat })
                    }
                  >
                    <FaEdit/>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="py-8 text-gray-400 text-sm italic text-center"
              >
                {isLoading ? "Loading...." : "No categories found."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <OfferModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        item={offerCategory}
        addOffer={handleAddOffer}
        removeOffer={removeOffer}
        data={data} 
      />
    </div>
  );
}

export default CategoryTable;
