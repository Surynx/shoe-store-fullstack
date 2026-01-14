import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { get, useForm } from "react-hook-form";
import { X } from "lucide-react";
import { addProduct, editProduct, getAllbrand, getAllCategory } from "../../Services/admin.api";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { toast } from "react-toastify";
import ErrorMessage from "../../components/admin/ErrorMessage";
import { validateFile } from "../../utils/user/fileValidate";

function AddProduct() {

  const {state} = useLocation();
  const {id} = useParams();
  
  const { register, handleSubmit, reset, formState:{errors} } = useForm();

  const [categoryList, setCategoryList] = useState();
  const [brandList, setBrandList] = useState();

  const [loading,setLoading] = useState(false);

  const [existingImages,setExistingImages] = useState([]);

  useEffect(() => {

    async function getData() {
      const categoryList = await getAllCategory();
      const brandList = await getAllbrand();

      setCategoryList(categoryList.data.docs);
      console.log(categoryList.data.docs);
      setBrandList(brandList.data.docs);

      //edit data fetch
      if(id) {
       reset({
       category:state.category_id,
       brand:state.brand_id,
       name:state.name,
       description:state.description,
       type:state.type,
       status:state.status,
       gender:state.gender
       });

       setPreview(state.productImages || []);
       setExistingImages(state.productImages);
    }
    }

    getData();
  }, []);

  const navigate = useNavigate();

  const [blobs, setBlob] = useState([]);
  const [preview, setPreview] = useState([]);

  const [cropImage, setCropImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  let cropperRef = useRef(null);

  const removeImage = (i) => {
    let update = preview.filter((url, index) => index != i);
    setPreview(update);
    setExistingImages(update);
  };

  const handleImages = (event) => {

    if(preview.length == 4) {
      toast.warning("Cannot Upload More!");
      return 0;
    }

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const valid = validateFile(file);

    if( !valid ) {

      return toast.error("Invalid File Format!");

    }

    const reader = new FileReader();

    reader.onload = () => {
      setCropImage(reader.result);
      setShowCropper(true);
    };

    reader.readAsDataURL(file);
  };

  const saveCropImage = () => {

    const cropper = cropperRef.current.cropper;
    const cropperCanvas = cropper.getCroppedCanvas({
      width: 600,
      height: 600,
    });

    //setting blob
    cropperCanvas.toBlob((blob) => {
      setBlob([...blobs, blob]);
    });

    const imageUrl = cropperCanvas.toDataURL("image/jpeg");
    setPreview([...preview, imageUrl]);
    setShowCropper(false);
  };

  //handle-submit
  const submit = async(data) => {

    if(preview.length == 0) {
      toast.error("Upload Product Image!");
      return 0;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category_id",data.category);
    formData.append("brand_id",data.brand);
    formData.append("type",data.type);
    formData.append("description",data.description);
    formData.append("status",data.status);
    formData.append("gender",data.gender);

    blobs.map((blob,i)=>{

      formData.append("productImages",blob,`${data.name}_image${i}.jpg`);
    });

    try{

      let res;

      if(id) {

        formData.append("existingImages",JSON.stringify(existingImages));
        res= await editProduct(formData,id);

      }else {
        res= await addProduct(formData);
      }
      
      if(res) {
        toast.success(res.data.message);
        navigate("/admin/product");
        setLoading(false);
      }

    }catch(error) {

      setLoading(false)
      toast.warning(error.response?.data?.message);

    }
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
    <div className="p-10 bg-gray-50 min-h-screen relative">
      {showCropper ? (
        <div className="inset-0 z-50 flex absolute justify-center backdrop-blur-xs items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Crop Product Image
            </h2>
            <Cropper
              src={cropImage}
              ref={cropperRef}
              style={{ height: 600, width: "100%" }}
              aspectRatio={1}
              viewMode={1}
              guides={true}
              dragMode="move"
              cropBoxResizable={true}
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowCropper(false)}
                className="px-2 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-sm font-bold"
              >
                Cancel
              </button>
              <button
                onClick={saveCropImage}
                className="px-2 py-1 bg-green-700 text-white rounded-md hover:bg-green-800 outline-none text-sm font-bold"
              >
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category",{required:"field is empty!"})}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none"
              >
                <option value="">Select Category</option>
                {categoryList?.length > 0
                  ? categoryList.map((item, i) => (
                      <option key={i} value={item._id}>{item.name}</option>
                    ))
                  : null}
              </select>
              <ErrorMessage elem={errors?.category}/>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                {...register("brand",{required:"field is empty!"})}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none"
              >
                <option value="">Select brand</option>
                {brandList?.length > 0
                  ? brandList.map((item, i) => (
                      <option key={i} value={item._id}>{item.name}</option>
                    ))
                  : null}
              </select>
              <ErrorMessage elem={errors.brand}/>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name",{required:"field is empty!",pattern:{value:/^[A-Za-z&\-'. ]{2,50}$/,message:"Invalid Name"}})}
                placeholder="Enter product name"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none placeholder-gray-400"
              />
              <ErrorMessage elem={errors.name}/>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type of Shoes <span className="text-red-500">*</span>
              </label>
              <select
                {...register("type",{required:"field is empty!"})}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none"
              >
                <option value="">Select type</option>
                <option value="Sneakers">Sneakers</option>
                <option value="Running">Running</option>
                <option value="Formal">Formal</option>
                <option value="Casual">Casual</option>
                <option value="Loafers">Loafers</option>
                <option value="Sandals">Sandals</option>
              </select>
              <ErrorMessage elem={errors.type}/>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                {...register("gender",{required:"field is empty!"})}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none"
              >
                <option value="">Select gender</option>
                <option value="Male">Men</option>
                <option value="Female">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
              <ErrorMessage elem={errors.gender}/>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("description",{required:"field is empty!"})}
                rows="3"
                placeholder="Enter product description"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none resize-none placeholder-gray-400"
              ></textarea>
              <ErrorMessage elem={errors.description}/>
            </div>
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
                    className="w-44 h-40 rounded-md border border-gray-200 shadow-sm relative overflow-hidden"
                  >
                    <img src={url} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="bg-red-600 m-1 cursor-pointer animate-bounce text-white rounded-full p-1 absolute top-1 right-1 hover:bg-red-700"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Product Status
              </label>
              <p className="text-gray-500 text-xs">
                Toggle ON to make this product available
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                {...register("status")}
                type="checkbox"
                className="sr-only peer"
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
