import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { addCategory, editCategory } from "../../Services/adminApi";
import { toast } from 'react-toastify';
import { useEffect } from "react";


function AddCategory() {

    const navigate = useNavigate();
    const { register, handleSubmit,reset } = useForm();

    const {id}= useParams();
    const {state}= useLocation();

   useEffect(()=>{
    
    if(id) {
        reset({
            name:state.name,
            description:state.description,
            status:state.status
        });
    }
   },[]);

    const submit = async (data) => {
        let res;
        try{

            if(!id) {
                res=await addCategory(data);
            }else {
                res=await editCategory(id,data);
            }
            
            if(res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/category");
                reset()
            }
        }catch(err) {
            
            toast.error(err.response.data.message);
        }
    }       
    

    return (
        <div className="p-10 bg-gray-50 min-h-screen">

            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/admin/category")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                    >
                        <FaArrowLeft className="text-lg" />
                        <span className="text-sm font-semibold">Back to Categories</span>
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto bg-white rounded-md p-8 border">
                <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                    Add New Category
                </h1>

                <form className="space-y-6" onSubmit={handleSubmit(submit)}>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g., shoes, sandles"
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none placeholder-gray-400"
                            {...register("name")}
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Write a short description for this category..."
                            className="w-full border border-gray-300 rounded-lg p-3 h-28 text-sm  focus:outline-none placeholder-gray-400"
                            {...register("description")}
                        ></textarea>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Status
                            </label>
                            <p className="text-gray-500 text-xs">
                                Toggle ON to make this category active
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
                            Add Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCategory