import { useNavigate } from "react-router-dom";

function CategoryTable({ data, isLoading }) {
    
    const nav=useNavigate();
    
    let categories = data?.data?.docs || [];

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
                                        <span className="text-xs font-bold text-gray-400">No description</span>
                                    )}
                                </td>

                                <td className="py-4 px-6 text-gray-400 text-xs">
                                    {cat.productCount
                                        ? `${cat.productCount} products`
                                        : "No products"}
                                </td>

                                <td className="py-4 px-6">
                                    <button
                                        className="flex items-center gap-1 text-blue-600 cursor-pointer hover:underline"
                                        onClick={() => handleOfferClick(cat._id)}
                                    >
                                        <i className="fa-solid fa-tags"></i>
                                        {cat.offers && cat.offers.length > 0
                                            ? `${cat.offers.length} offers`
                                            : "Add Offer"}
                                    </button>
                                </td>

                                <td className="py-4 px-6">
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${cat.status
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
                                        onClick={()=>nav(`/admin/category/edit/${cat._id}`,{state:cat})}
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i>
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
                             {(isLoading) ? "Loading...." :  "No categories found."}  
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

    )
}

export default CategoryTable