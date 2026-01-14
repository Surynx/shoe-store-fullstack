import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import ErrorMessage from '../ErrorMessage';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { editBannerPosition } from '../../../Services/admin.api';

export default function EditBannerModal({ isOpen, onClose, banner }) {

  const { register,handleSubmit,formState: { errors },reset,setValue } = useForm({
    defaultValues: {
      position: ''
    }
  });

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (banner && isOpen) {
      setValue('position', banner.position?.toString() || '');
    }
  }, [banner, isOpen, setValue]);

  const onSubmitForm = async (data) => {

    try {

      const res = await editBannerPosition(banner._id,data);

      if(res) {

        toast.success(res.data.message);
        queryClient.invalidateQueries("banner-list");
        handleClose();
      }
      
    } catch (error) {
      
      toast.error(error.response.data.message);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !banner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-500 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit Banner Position</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-white rounded-full p-1 transition-all cursor-pointer hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Banner Preview */}
          {banner && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Current Banner
              </label>
              <div className="border rounded-lg p-3 bg-gray-50">
                {banner.image && (
                  <img 
                    src={banner.image} 
                    alt={banner.title || 'Banner'}
                    className="w-full h-32 object-contain rounded-lg mb-2"
                  />
                )}
                {banner.title && (
                  <p className="text-sm font-medium text-gray-800">{banner.title}</p>
                )}
                {banner.sub_title && (
                  <p className="text-xs text-gray-600 mt-1">{banner.sub_title}</p>
                )}
              </div>
            </div>
          )}

          {/* Editable Position Field */}
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

          {/* Read-only info message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              Only the banner position can be edited. To change the image, title, or subtitle, please delete and create a new banner.
            </p>
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
            type="button"
            onClick={handleSubmit(onSubmitForm)}
            disabled={loading}
            className="flex-1 px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-gray-700 to-gray-500 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Position"}
          </button>
        </div>
      </div>
    </div>
  );
}