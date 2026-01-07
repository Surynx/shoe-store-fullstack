import { useForm } from 'react-hook-form';
import { X, Upload } from 'lucide-react';
import ErrorMessage from '../ErrorMessage';
import { addNewBanner } from '../../../Services/admin.api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function AddBannerModal({ isOpen, onClose }) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    defaultValues: {
      position: '',
      image: '',
      title: '',
      sub_title: '',
      isActive: true
    }
  });

  const QueryClient = useQueryClient();

  const [preview, setPreview] = useState(null);
  
  const [ loading,setLoading ] = useState(false);
 
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setValue("image", file, { shouldValidate: true });
  };


  const onSubmitForm = async (data) => {

    try {

    setLoading(true);

    const formData = new FormData();

    formData.append("position", data.position);
    formData.append("image", data.image); 
    formData.append("title", data.title);
    formData.append("sub_title", data.sub_title);

    const res = await addNewBanner(formData);

    if(res){

        toast.success(res.data.message);
        QueryClient.invalidateQueries("banner-list");
        handleClose();
    }

    } catch (error) {

      console.error(error);

      toast.error(error.response.data.message);
    }

    setLoading(false);

  };

  const handleClose = () => {
    reset();
    setPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-500 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add New Banner</h2>
          <button
            onClick={handleClose}
            className="text-white rounded-full p-1 transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(85vh-120px)]">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Position <span className="text-red-500">*</span>
            </label>
            <select
              {...register('position', { required: 'Position is required' })}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                errors.position ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select position</option>
              <option value="1">Position 1</option>
              <option value="2">Position 2</option>
              <option value="3">Position 3</option>
              <option value="4">Position 4</option>
              <option value="5">Position 5</option>
            </select>
            <ErrorMessage elem={errors.position}/>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Banner Image <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${
                errors.image ? 'border-red-500' : 'border-gray-300'
              }`}>
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="h-full w-full object-contain rounded-lg p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <input
                type="hidden"
                {...register('image', { required: 'Image is required' })}
              />
              <ErrorMessage elem={errors.image}/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('title', { 
                required: 'Title is required',
                validate: value => value.trim() !== '' || 'Title is required'
              })}
              placeholder="Enter banner title"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <ErrorMessage elem={errors.title}/>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Subtitle <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('sub_title', { 
                required: 'Subtitle is required',
                validate: value => value.trim() !== '' || 'Subtitle is required'
              })}
              placeholder="Enter banner subtitle"
              rows="2"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none transition-all ${
                errors.sub_title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <ErrorMessage elem={errors.sub_title}/>
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4 bg-gray-50 border-t">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmitForm)}
            disabled={loading}
            className="flex-1 px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-gray-700 to-gray-500 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all shadow-md cursor-pointer"
          >
            {(loading) ? "Uploading..." : "Add Banner"}
          </button>
        </div>
      </div>
    </div>
  );
}