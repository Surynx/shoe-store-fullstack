import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ErrorMessage from "../ErrorMessage";
import { updateBannerPosition } from "../../../Services/admin.api";

export default function EditBannerPositionModal({

  isOpen,
  onClose,
  bannerId,
  currentPosition
  
}) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      position: currentPosition || ""
    }
  });

  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (isOpen) {
      reset({ position: currentPosition });
    }

  }, [isOpen, currentPosition, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await updateBannerPosition(bannerId, {position: data.position});

      if (res) {

        toast.success(res.data.message || "Position updated");
        queryClient.invalidateQueries(["banner-list"]);
        handleClose();

      }
    } catch (error) {

      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update position"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        
       
        <div className="bg-gradient-to-r from-gray-700 to-gray-500 px-5 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            Edit Banner Position
          </h2>
          <button onClick={handleClose} className="text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

       
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Position <span className="text-red-500">*</span>
            </label>

            <select
              {...register("position", {
                required: "Position is required"
              })}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-500 ${
                errors.position ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select position</option>
              <option value="1">Position 1</option>
              <option value="2">Position 2</option>
              <option value="3">Position 3</option>
              <option value="4">Position 4</option>
              <option value="5">Position 5</option>
            </select>

            <ErrorMessage elem={errors.position} />
          </div>

        
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-gray-700 to-gray-500 rounded-lg hover:from-gray-800 hover:to-gray-600"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
