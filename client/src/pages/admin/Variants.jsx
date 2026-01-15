import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import VariantsList from "../../components/admin/VariantsList";
import { addVariant, updateVariant } from "../../Services/admin.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllVariant } from "../../Services/admin.api";
import { toast } from "react-toastify";
import ErrorMessage from "../../components/admin/ErrorMessage";

export default function AddVariant() {
  const { id } = useParams();

  const QueryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["varientInfo"],
    queryFn: () => getAllVariant(id),
  });

  const { state } = useLocation();

  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  //edit logic
  const [editVarient, setEditVarient] = useState(null);

  useEffect(() => {
    if (editVarient != null) {
      reset(editVarient);
    } else {
      reset({
        size: "",
        stock: "",
        original_price: "",
        sales_price: "",
        discount: "",
      });
    }
  }, [editVarient]);

  const submit = async (data) => {
    try {
      let res;

      if (editVarient) {
        res = await updateVariant(data, id);
        setEditVarient(null);
        reset();
      } else {
        res = await addVariant(data, id);
      }

      if (res) {
        toast.success(res.data.message);
        QueryClient.invalidateQueries("varientInfo");
        reset();
      }
    } catch (error) {
      toast.warn(error.response.data.message);
    }
  };

  if(isLoading) {

    return (<div className="flex items-center justify-center h-screen space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.2s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.4s]"></div>
      </div>)
  }

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
          {/* Size */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-semibold">Size</label>
            <select
              {...register("size", {
                required: "Size is required",
              })}
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
            <ErrorMessage elem={errors.size} />
          </div>

          {/* Stock */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-semibold">Stock</label>
            <input
              type="number"
              placeholder="Stock"
              {...register("stock", {
                required: "Stock is required",
                min: {
                  value: 0,
                  message: "Stock cannot be negative",
                },
              })}
              className="border text-sm p-2 rounded-md outline-none"
            />
            <ErrorMessage elem={errors.stock} />
          </div>

       
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-semibold">
              Original Price
            </label>
            <input
              type="number"
              placeholder="Original Price"
              {...register("original_price", {
                required: "Original price is required",
                min: {
                  value: 1,
                  message: "Price must be greater than 0",
                },
              })}
              className="border text-sm p-2 rounded-md outline-none"
            />
            <ErrorMessage elem={errors.original_price} />
          </div>

          {/* Sales Price */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-semibold">
              Sales Price
            </label>
            <input
              type="number"
              placeholder="Sales Price"
              {...register("sales_price", {
                required: "Sales price is required",
                min: {
                  value: 1,
                  message: "Sales price must be greater than 0",
                },
                validate: (value, formValues) =>
                  Number(value) <= Number(formValues.original_price) ||
                  "Sales price cannot be greater than original price",
              })}
              className="border text-sm p-2 rounded-md outline-none"
            />
            <ErrorMessage elem={errors.sales_price} />
          </div>

          {/* Discount */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-semibold">
              Discount (%)
            </label>
            <input
              type="number"
              placeholder="Discount %"
              {...register("discount", {
                min: {
                  value: 0,
                  message: "Discount cannot be negative",
                },
                max: {
                  value: 100,
                  message: "Discount cannot exceed 100%",
                },
              })}
              className="border text-sm p-2 rounded-md outline-none"
            />
            <ErrorMessage elem={errors.discount} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className={`px-2 py-1.5 rounded-md text-xs text-white font-medium ${
              editVarient
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editVarient ? "Update Variant" : "Add Variant"}
          </button>
        </div>

        <span className="animate-pulse italic">
          Adding Variants for{" "}
          <span className="text-green-700">{state.name}</span> → category:{" "}
          <span className="text-green-700">{state.category}</span>
        </span>
      </form>

      <VariantsList
        data={data}
        QueryClient={QueryClient}
        setEditVarient={setEditVarient}
      />
    </div>
  );
}
