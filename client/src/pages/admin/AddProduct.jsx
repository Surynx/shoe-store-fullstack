import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FcCancel } from "react-icons/fc";
import { AwardIcon, Cross, List, X } from "lucide-react";
import { getAllbrand, getAllCategory } from "../../Services/adminApi";

function AddProduct() {
  const navigate = useNavigate();

  const { register, handleSubmit, reset, watch } = useForm();

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [categoryList , setCategoryList]= useState();
  const [brandList , setBrandList]= useState();

  useEffect(()=>{
    async function getData() {

        const categoryList= await getAllCategory();
        const brandList= await getAllbrand();

        setCategoryList(categoryList.data.docs);
        setBrandList(brandList.data.docs);
    }

    getData();
    
  },[]);

  const removeImage= (i)=>{

    let update=preview.filter((url,index)=> index != i);
    setPreview(update);
  }

  const handleImages = (event) => {

    const file = event.target.files[0];
    const url = URL.createObjectURL(file);

    setPreview([...preview, url]);
  };

  const submit= (data)=>{

  }



  return (
    <div className="p-10 bg-gray-50 min-h-screen">
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

      <div className="max-w-2xl mx-auto bg-white rounded-md p-8 border">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Add New Product
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit(submit)}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none">
              <option value="">Select category</option>
              {categoryList?.length > 0 ?
              categoryList.map((item,i)=><option key={i}>{item.name}</option>) :
              null}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brand <span className="text-red-500">*</span>
            </label>
            <select className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none">
              <option value="">Select brand</option>
              {brandList?.length > 0 ?
              brandList.map((item,i)=><option key={i}>{item.name}</option>) :
              null}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              placeholder="Enter product description"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none resize-none placeholder-gray-400"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Images <span className="text-red-500">*</span>
            </label>

            <label
              htmlFor="productImages"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-700 hover:bg-gray-50 transition-all relative overflow-hidden"
            >
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
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>

              <input
                id="productImages"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleImages(event)}
              />
            </label>
          </div>
          {preview.length > 0 ? (
            <div className="w-full h-50 p-3 overflow-y-auto">
              <div className="flex flex-wrap gap-3">
                {preview.map((url, i) => (
                  <div
                    key={i}
                    className="w-44 h-40 rounded-md border border-gray-200 shadow-sm relative overflow-hidden">
                    <img src={url} className="w-full h-full object-cover" />
                    
                    <button
                      type="button"
                      onClick={()=>removeImage(i)}
                      className="bg-red-600 m-1 cursor-pointer animate-bounce text-white rounded-full p-1 absolute top-1 right-1 hover:bg-red-700"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Product Status
              </label>
              <p className="text-gray-500 text-xs">
                Toggle ON to make this product available
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
