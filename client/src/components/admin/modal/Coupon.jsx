import { Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { addNewCoupon, changeCouponStatus } from "../../../Services/admin.api";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import { useEffect } from "react";

function CouponModal({ isOpen, onClose, editCoupon, setEditCoupon }) {
  const queryClient = useQueryClient();

  const { register,handleSubmit,reset,watch,formState: { errors } } = useForm({
    defaultValues: {
      code: "",
      type: "percentage",
      value: "",
      min_purchase: 0,
      usageLimit: 0,
      startDate: "",
      endDate: "",
      status: true,
    },
  });

  useEffect(() => {
    if (editCoupon) {
      reset({
        code: editCoupon.code,
        type: editCoupon.type,
        value: editCoupon.value,
        min_purchase: editCoupon.min_purchase,
        usageLimit: editCoupon.usageLimit,
        startDate: new Date(editCoupon.start_date).toISOString().split("T")[0],
        endDate: new Date(editCoupon.end_date).toISOString().split("T")[0],
        status: editCoupon.status,
      });
    }
  }, [editCoupon]);

  const startDate = watch("startDate");

  const onSubmit = async (data) => {
    try {
      let res;

      if (editCoupon) {
        res = await changeCouponStatus(editCoupon._id, data);
      } else {
        res = await addNewCoupon(data);
      }

      if (res?.data?.success) {
        toast.success(res.data.message);
        queryClient.invalidateQueries(["coupon-data"]);
        reset();
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleCloseModal = () => {
    reset({
      code: "",
    });
    setEditCoupon(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex gap-1 items-center">
            <Tag /> Add New Coupon
          </h2>
          <button
            type="button"
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Coupon Code */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Coupon Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("code", {
                  required: "Coupon code is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm uppercase"
                placeholder="SAVE20"
              />
              <ErrorMessage elem={errors.code} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Total Usage Limit
              </label>
              <input
                type="number"
                {...register("usageLimit", {
                  min: {
                    value: 0,
                    message: "Usage limit cannot be negative",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="0 (unlimited)"
              />
              <ErrorMessage elem={errors.usageLimit} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register("type", {
                  required: "Discount type is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount</option>
              </select>
              <ErrorMessage elem={errors.type} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <ErrorMessage elem={errors.startDate} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("value", {
                  required: "Discount value is required",
                  min: {
                    value: 0,
                    message: "Discount cannot be negative",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="20"
              />
              <ErrorMessage elem={errors.value} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("endDate", {
                  required: "End date is required",
                  validate: (value) =>
                    value > startDate || "End date must be after start date",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <ErrorMessage elem={errors.endDate} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Minimum Purchase Amount
              </label>
              <input
                type="number"
                {...register("min_purchase", {
                  min: {
                    value: 0,
                    message: "Minimum purchase cannot be negative",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="0"
              />
              <ErrorMessage elem={errors.min_purchase} />
            </div>

            {/* Status */}
            <div className="col-span-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("status")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                />
                <span className="ml-2 text-xs font-semibold text-green-700">
                  Active Status
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleCloseModal}
            className="px-4 py-2 border border-gray-700 text-black hover:bg-gray-100 text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-2 bg-green-700 text-white hover:bg-green-800 text-xs font-bold cursor-pointer"
          >
            {editCoupon ? "Update Coupon" : "Create Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CouponModal;
