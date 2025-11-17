import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addBrand, editBrand } from "../../Services/admin.api";
import { useEffect, useState } from "react";

function AddBrand() {
  const { id } = useParams();
  const { state } = useLocation();

  const { register, handleSubmit, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);

  let logoFile = watch("logo");

  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  //preview logic
  useEffect(() => {
    if (logoFile && logoFile[0]) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreview(fileReader.result);
      fileReader.readAsDataURL(logoFile[0]);
    } else {
      setPreview(null);
    }
  }, [logoFile]);

  //brand data fetch
  useEffect(() => {
    if (id) {
      reset({
        name: state.name,
        status: state.status,
      });
      setPreview(state.logo);
    }
  }, []);

  //edit / add logic
  const submit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("logo", data.logo[0]);
    formData.append("status", data.status);

    try {
      let res;
      setLoading(true);
      if (id) {
        res = await editBrand(formData, id);
      } else {
        res = await addBrand(formData);
      }

      toast.success(res.data.message);
      navigate("/admin/brand", { replace: true });
    } catch (error) {
      toast.warning(error.response.data.message);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.2s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.4s]"></div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/brand")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <FaArrowLeft className="text-lg" />
            <span className="text-sm font-semibold">Back to Brands</span>
          </button>
        </div>
      </div>

      <div className="max-w-120 mx-auto bg-white rounded-md p-8 border">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Add New Brand
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit(submit)}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Nike, Adidas, Puma"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none placeholder-gray-400"
              {...register("name", { required: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brand Logo <span className="text-red-500">*</span>
            </label>

            <label
              htmlFor="brandLogo"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-700 hover:bg-gray-50 transition-all relative overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Brand Logo Preview"
                  className="absolute inset-0 w-full h-full object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6H16a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">
                    Click to upload logo
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG or SVG (max 2MB)
                  </p>
                </div>
              )}

              <input
                id="brandLogo"
                type="file"
                accept="image/*"
                className="hidden"
                {...register("logo")}
              />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <p className="text-gray-500 text-xs">
                Toggle ON to make this brand active
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register("status")}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors duration-300"></div>
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></span>
            </label>
          </div>
          <div className="border-t border-gray-200 my-6"></div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="px-4 py-2.5 bg-green-800 text-white text-sm font-semibold rounded-md hover:bg-green-900 transition-all cursor-pointer"
            >
              Add Brand
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBrand;
