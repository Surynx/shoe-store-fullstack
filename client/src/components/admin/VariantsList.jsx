
import { Edit, X } from "lucide-react";
import { removeVariant } from "../../Services/admin.api";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function VarientsList({data,QueryClient,setEditVarient}) {

  const variants= data?.data?.variantDocs || [];

  const handleDelete= async(id)=>{
    let res= await removeVariant(id);
    QueryClient.invalidateQueries("varientInfo");

    if(res) {
      toast.success(res.data.message);
    }
  }

  return (
    <div className="bg-white border rounded-lg p-5">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Variants Added
      </h2>

      {variants.length === 0 ? (
        <p className="text-gray-500 text-sm">No variants added yet.</p>
      ) : (
        <div className="space-y-2">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-between border border-gray-100 bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition"
            >
              <div className="flex flex-wrap gap-5 text-sm text-gray-700">
                <p>
                  <span className="font-bold">Size:</span>  <span className="text-green-800 font-bold">₹{variant.size}</span>
                </p>
                <p>
                  <span className="font-bold">Stock:</span> <span className="text-green-800 font-bold">{variant.stock}</span>
                </p>
                <p>
                  <span className="font-bold">Original:</span> ₹
                   <span className="text-red-700">{variant.original_price}</span>
                </p>
                <p>
                  <span className="font-bold">Sale:</span> 
                  <span className="text-red-700">₹{variant.sales_price}</span>
                </p>
                <p>
                  <span className="font-bold">Discount:</span>{" "}
                  <span className="text-red-700">{variant.discount || 0}%</span>
                </p>
              </div>

              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <button
                  type="button"
                  onClick={()=>setEditVarient(variant)}
                  className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  
                  className="text-red-600 hover:text-red-800 transition cursor-pointer"
                >
                  <X size={16} onClick={()=>handleDelete(variant._id)}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VarientsList;
