import { Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { addNewCoupon } from '../../../Services/admin.api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

function AddCouponModal({ isOpen, onClose }) {

  const QueryClient= useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      min_purchase: '0',
      usageLimit: '0',
      usagePerUser: '1',
      startDate: '',
      endDate: '',
      status: true
    }
  });

  const onSubmit = async(data) => {

    try{
    const res= await addNewCoupon(data);

    if(res?.data?.success) {
      toast.success(res.data.message);
      QueryClient.invalidateQueries("coupon-data");
      reset({code:""});
      onClose();
    }
  
    }catch(error) {

        console.log(error);
        toast.error(error.response.data.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-3xl ml-30">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex gap-1 items-center"><Tag/> Add New Coupon</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

     
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Coupon Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('code', { required: 'Coupon code is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase text-sm"
                placeholder="SAVE20"
              />
              {errors.code && (
                <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
              )}
            </div>

            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount</option>
              </select>
            </div>

            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('value', { 
                  required: 'Discount value is required',
                  min: { value: 0, message: 'Must be at least 0' }
                })}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="20"
              />
              {errors.discount_value && (
                <p className="text-red-500 text-xs mt-1">{errors.discount_value.message}</p>
              )}
            </div>

            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Minimum Purchase Amount
              </label>
              <input
                type="number"
                {...register('min_purchase', { min: 0 })}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="0"
              />
            </div>

            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Total Usage Limit
              </label>
              <input
                type="number"
                {...register('usageLimit', { min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="0 (unlimited)"
              />
            </div>

           
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Usage Per User
              </label>
              <input
                type="number"
                {...register('usagePerUser', { min: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="1"
              />
            </div>

           
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
              )}
            </div>

           
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('endDate', { required: 'End date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>
              )}
            </div>

          
            <div className="col-span-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('status')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-2 text-xs font-semibold text-green-700">
                  Active Status
                </span>
              </label>
            </div>
          </div>
        </div>

      
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-md">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 text-black hover:bg-gray-100 transition-colors font-medium text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-2 cursor-pointer bg-green-700 text-white hover:bg-green-800 transition-colors font-medium text-sm shadow-sm"
          >
            Create Coupon
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCouponModal;