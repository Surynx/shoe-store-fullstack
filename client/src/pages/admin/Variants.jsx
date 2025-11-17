import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import VariantsList from "../../components/admin/VariantsList";
import { addVariant, updateVariant } from "../../Services/admin.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllVariant } from "../../Services/admin.api";
import { toast } from "react-toastify";

export default function AddVariant() {
  const { id } = useParams();

  const QueryClient= useQueryClient();

  const { data,isLoading }= useQuery({
    queryKey:["varientInfo"],
    queryFn:()=>getAllVariant(id),
  });

  const { state } = useLocation();

  const navigate = useNavigate();

  const { handleSubmit, reset, register } = useForm();

  //edit logic
  const [ editVarient,setEditVarient ] = useState(null);

  useEffect(()=>{
    
    if(editVarient != null){
      reset(editVarient);

    }else {

      reset({
      size: "",
      stock: "",
      original_price: "",
      sales_price: "",
      discount: "",
    });
    }
    
  },[editVarient]);

  const submit = async (data) => {
  try { 

    let res;

    if(editVarient) {
      res= await updateVariant(data, id);
      setEditVarient(null);
      reset();

    }else {
      res = await addVariant(data, id);
    }

    if(res) {
      toast.success(res.data.message);
      QueryClient.invalidateQueries("varientInfo");
      reset();
    }
  }catch(error) {
    toast.warn(error.response.data.message);
  }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/product")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <FaArrowLeft className="text-lg" />
            <span className="text-sm font-semibold">Back to Products</span>
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-6 text-gray-700">
        Add Variants
      </h1>

      <form
        onSubmit={handleSubmit(submit)}
        className="bg-white border border-green-700 rounded-lg p-5 mb-8 text-xs"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        
          <div className="flex flex-col">
            <label htmlFor="size" className="mb-1 text-gray-700 font-semibold">
              Size
            </label>
            <select
              id="size"
              {...register("size", { required: true })}
              disabled={editVarient != null}
              className="border text-sm p-2 rounded-md outline-none"
            >
              <option value="">Select Size</option>
              <option value="UK 3">UK 3</option>
              <option value="UK 4">UK 4</option>
              <option value="UK 5">UK 5</option>
              <option value="UK 6">UK 6</option>
              <option value="UK 7">UK 7</option>
            </select>
          </div>

         
          <div className="flex flex-col">
            <label htmlFor="stock" className="mb-1 text-gray-700 font-semibold">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              placeholder="Stock"
              {...register("stock", { required: true })}
              className="border text-sm p-2 rounded-md outline-none"
            />
          </div>

          
          <div className="flex flex-col">
            <label
              htmlFor="original_price"
              className="mb-1 text-gray-700 font-semibold"
            >
              Original Price
            </label>
            <input
              id="original_price"
              type="number"
              placeholder="Original Price"
              {...register("original_price", { required: true })}
              className="border text-sm p-2 rounded-md outline-none"
            />
          </div>

          
          <div className="flex flex-col">
            <label
              htmlFor="sales_price"
              className="mb-1 text-gray-700 font-semibold"
            >
              Sales Price
            </label>
            <input
              id="sales_price"
              type="number"
              placeholder="Sales Price"
              {...register("sales_price", { required: true })}
              className="border text-sm p-2 rounded-md outline-none"
            />
          </div>

       
          <div className="flex flex-col">
            <label
              htmlFor="discount"
              className="mb-1 text-gray-700 font-semibold"
            >
              Discount (%)
            </label>
            <input
              id="discount"
              type="number"
              placeholder="Discount %"
              {...register("discount")}
              className="border text-sm p-2 rounded-md outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className={`px-2 py-1.5 flex gap-1 rounded-md text-xs text-white font-medium transition cursor-pointer ${
              editVarient !== null
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editVarient !== null ? "Update Variant" : "Add Variant"}
          </button>
        </div>

        <span className="animate-pulse italic">
          Adding Variants for{" "}
          <span className="text-green-700">{state.name}</span> → category:{" "}
          <span className="text-green-700">{state.category}</span>
        </span>
      </form>

      <VariantsList data={data} QueryClient={QueryClient} setEditVarient={setEditVarient}/>
    </div>
  );
}
