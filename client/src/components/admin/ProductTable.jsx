import { Eye, Folder, FolderArchive, FolderClock, FolderCog, Plus } from "lucide-react";
import { FaEdit, FaTrash, FaTag, FaPlus } from "react-icons/fa";
import { VscActivateBreakpoints } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

function ProductTable({ docs = [] }) {

  const nav=useNavigate();


  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <table className="w-full text-sm font-medium text-gray-700">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="py-3 px-5 text-center w-[10%]">Image</th>
            <th className="py-3 px-5 text-center w-[20%]">Product</th>
            <th className="py-3 px-5 text-center w-[15%]">Category</th>
            <th className="py-3 px-5 text-center w-[15%]">Brand</th>
            <th className="py-3 px-5 text-center w-[10%]">Stock</th>
            <th className="py-3 px-5 text-center w-[15%]">Status</th>
            <th className="py-3 px-2 text-center w-[10%]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {docs.length > 0 ? (
            docs.map((doc) => (
              <tr
                key={doc._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-all"
              >
                <td className="py-4 px-5 text-center">
                  <img
                    src={doc.productImages[0]}
                    alt={doc.name}
                    className="w-12 h-12 rounded-md object-cover shadow-sm mx-auto"
                  />
                </td>

                <td className="py-4 px-5 text-center font-bold text-sm text-black">
                  {doc.name}
                </td>

                <td className="py-4 px-5 text-center font-semibold italic text-gray-500">
                  {doc.category_id?.name}
                </td>

                <td className="py-4 px-5 flex justify-center font-bold">
                  <img
                      src={doc.brand_id.logo}
                      className="w-12 h-12 object-fill rounded-2xl border border-gray-400"
                    />
                </td>

                <td className="py-4 px-5 text-center">{doc.stock || 0}</td>

                <td className="py-4 px-5 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      doc?.status > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {doc?.status > 0 ? "List" : "Unlist"}
                  </span>
                </td>

                <td className="py-4 px-3 text-center">
                  <div className="flex justify-center gap-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-lg cursor-pointer"
                      title="Edit Product"
                      onClick={()=>nav(`/admin/product/add/${doc._id}`,{state:doc})}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="text-green-600 hover:text-green-800 text-lg"
                      title="Apply Offer"
                    >
                      <FaTag />
                    </button>

                    <button
                      onClick={()=>nav(`/admin/product/varient/${doc._id}`,{state:{name:doc.name,category:doc.category_id.name}})}
                      className="text-xs font-bold cursor-pointer flex border border-gray-500 text-black p-2 rounded-md hover:bg-gray-100"
                      title="Add Variant"
                    >
                      <Plus size={16}/> Varients 
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
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
