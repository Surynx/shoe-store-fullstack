import { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaImage } from "react-icons/fa";
import { deleteBanner } from "../../Services/admin.api";
import { useQueryClient } from "@tanstack/react-query";


function BannerList({ banners }) {

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const QueryClient = useQueryClient();

  const handleDeleteClick = (id) => {

    setDeleteConfirm(id);
  };

  const confirmDelete = async(id) => {

    const res = await deleteBanner(id);

    if(res.data.success) {
        
        QueryClient.invalidateQueries("banner-list");
        toast.success("Banner removed from Home Page!");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!banners || banners.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <FaImage className="mx-auto text-gray-300 text-6xl mb-4" />
        <p className="text-gray-500 text-lg">No banners available</p>
        <p className="text-gray-400 text-sm mt-2">
          Click "Add New Banner" to create your first banner
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {banners.map((banner) => (
              <tr key={banner._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                    {banner.position}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="h-16 w-24 object-cover rounded border border-gray-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/96x64?text=No+Image";
                    }}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-amber-800 max-w-xs truncate">
                    {banner.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-bold">
                  {formatDate(banner.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {deleteConfirm === banner._id ? (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => confirmDelete(banner._id)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition font-semibold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start">
                      {/* <button
                        onClick={() => onEdit(banner)}
                        className="p-1 text-blue-500 rounded text-xs font-bold flex items-center gap-1"
                        title="Edit Banner"
                      >
                       <FaEdit/> Edit Position?
                      </button> */}
                      <button
                        onClick={() => handleDeleteClick(banner._id)}
                        className="p-1 text-red-500 rounded text-xs font-bold cursor-pointer flex items-center gap-1"
                        title="Delete Banner"
                      >
                       <FaTrash/> Remove?
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BannerList;