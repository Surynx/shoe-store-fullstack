import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../admin/ErrorMessage";
import { addNewAddress, updateAddress } from "../../Services/user.api";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function AddressForm() {
  const nav = useNavigate();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { id } = useParams();
  const { state } = useLocation();

  useEffect(() => {
    if (id) {
      reset(state);
    }
  }, []);

  const submit = async (data) => {
    let res;

    try {
      if (id) {
        res = await updateAddress(data, id);
      } else {
        res = await addNewAddress(data);
      }

      if (res && res?.data?.success) {
        toast.success(res.data.message);
        reset();
        nav("/account/address");
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error("Something went Wrong!");
    }
  };

  return (
    <div className="max-w-5xl">
      <button
        onClick={() => nav("/account/address")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-10 cursor-pointer transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Addresses</span>
      </button>

      <div className="bg-white rounded-md p-6 border">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {id ? "Edit Address" : "Add New Address"}
        </h2>

        <form className="space-y-3" onSubmit={handleSubmit(submit)}>
          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Address Type
            </label>
            <select
              {...register("type", { required: "Address type is required" })}
              className="w-full px-3 py-2 border outline-none text-sm"
            >
              <option value="">Select</option>
              <option>Home</option>
              <option>Work</option>
              <option>Other</option>
            </select>
            <ErrorMessage elem={errors.type} />
          </div>

          {/* Name + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Full name is required",
                  pattern: {
                    value: /^(?=.*[A-Za-z])[A-Za-z.'\- ]{2,50}$/,
                    message: "Enter a valid name",
                  },
                })}
                className="w-full px-3 py-2 border outline-none text-sm"
                placeholder="Enter full name"
              />
              <ErrorMessage elem={errors.name} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter valid 10-digit phone number",
                  },
                })}
                className="w-full px-3 py-2 border outline-none text-sm"
                placeholder="9876543210"
              />
              <ErrorMessage elem={errors.phone} />
            </div>
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Address Line 1 *
            </label>
            <input
              type="text"
              {...register("line1", {
                required: "Address Line 1 is required",
                pattern: {
                  value: /^(?=.*[A-Za-z0-9])[A-Za-z0-9\s,./\-#]{5,100}$/,
                  message: "Enter a valid address",
                },
              })}
              className="w-full px-3 py-2 border outline-none text-sm"
              placeholder="House no, Street name"
            />
            <ErrorMessage elem={errors.line1} />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Address Line 2
            </label>
            <input
              type="text"
              {...register("line2", {
                pattern: {
                  value: /^(?=.*[A-Za-z0-9])[A-Za-z0-9\s,./\-#]{3,100}$/,
                  message: "Enter a valid landmark or area",
                },
              })}
              className="w-full px-3 py-2 border outline-none text-sm"
              placeholder="Landmark, Area (Optional)"
            />
            <ErrorMessage elem={errors.line2} />
          </div>

          {/* City, State, Pincode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                City *
              </label>
              <input
                type="text"
                {...register("city", {
                  required: "City is required",
                  pattern: {
                    value: /^(?=.*[A-Za-z])[A-Za-z ]{2,50}$/,
                    message: "Enter a valid city",
                  },
                })}
                className="w-full px-3 py-2 border outline-none text-sm"
                placeholder="City"
              />
              <ErrorMessage elem={errors.city} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                State *
              </label>
              <input
                type="text"
                {...register("state", {
                  required: "State is required",
                  pattern: {
                    value: /^(?=.*[A-Za-z])[A-Za-z ]{2,50}$/,
                    message: "Enter a valid state",
                  },
                })}
                className="w-full px-3 py-2 border outline-none text-sm"
                placeholder="State"
              />
              <ErrorMessage elem={errors.state} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pincode *
              </label>
              <input
                type="text"
                {...register("pin_code", {
                  required: "Pincode is required",
                  pattern: {
                    value: /^[1-9][0-9]{5}$/,
                    message: "Enter valid 6-digit pincode",
                  },
                })}
                className="w-full px-3 py-2 border outline-none text-sm"
                placeholder="673001"
              />
              <ErrorMessage elem={errors.pin_code} />
            </div>
          </div>

          {/* Default Address */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              {...register("isDefault")}
              className="w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Set as default address
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => nav("/account/address")}
              className="flex-1 px-3 py-2 border text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 px-3 py-2 border text-white bg-gray-700 hover:bg-gray-800 font-medium"
            >
              {id ? "Update Address" : "Add Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
