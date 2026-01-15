import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function BrandTable({ data, isLoading }) {

  let brands = data?.data?.docs || [];
  const navigate= useNavigate();

  return (
    <div className="p-1">
      <div className="overflow-x-auto bg-white rounded-md border-gray-200">
        <table className="w-full text-sm font-bold text-gray-700">
          <thead className="bg-gray-100 text-gray-600 font-semibold text-left">
            <tr>
              <th className="p-2 font-bold">Logo</th>
              <th className="p-2 font-bold">Brand Name</th>
              <th className="p-2 font-bold">Products</th>
              <th className="p-2 font-bold">Status</th>
              <th className="p-2 font-bold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {brands?.length > 0 ? (
              brands.map((brand) => (
                <tr
                  key={brand._id}
                  className=" hover:bg-gray-50 transition-all"
                >
                  <td className="p-4">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-12 h-12 object-fill rounded-2xl shadow-md border"
                    />
                  </td>
                  <td className="p-4 font-bold text-green-800">{brand.name}</td>
                  <td className="p-3 font-bold text-xs text-gray-500">
                    {brand.total_products
                      ? `${brand.total_products} products`
                      : "No products"}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        brand.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {brand.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/admin/brand/edit/${brand._id}`,{state:brand})}
                      className="text-blue-600 hover:text-blue-800 text-lg cursor-pointer"
                    >
                    <FaEdit/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center italic text-gray-400">
                  {(isLoading) ? "Loading...." :  "No Brand found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BrandTable;
