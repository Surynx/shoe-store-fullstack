import { Edit, Wallet, Users, Lock, Mail, LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../admin/ErrorMessage";
import { changePassword, sendOtpToEmail } from "../../Services/user.api";
import toast from "react-hot-toast";

export default function UserInfo() {
  const { data } = useOutletContext();

  const [user, setUser] = useState();
  const nav = useNavigate();

  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (data) {
      setUser(data.data.userInfo);
    }
  }, [data]);

  const handleOtpSent = async (data) => {
    setLoading(true);
    try {
      const res = await sendOtpToEmail({ email: user.email });

      if (res?.data?.success) {
        setOtpSent(true);
      } else {
        toast.error("Failed to send OTP");
        setOtpSent(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (data) => {
    try {
      const res = await changePassword(data);

      if(res?.data?.success) {

      toast.success(res.data.message);
      localStorage.removeItem("userEmail");
      nav("/login", { replace: true });
      }

    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Email Address</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone Number</p>
              <p className="font-medium">
                {user?.phone ? (
                  user.phone
                ) : (
                  <span className="font-semibold text-xs text-gray-400">
                    not provided
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Member Since</p>
              <p className="font-medium">
                {new Date(user?.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Gender</p>
              <p className="font-medium">
                {user?.gender ? (
                  user.gender
                ) : (
                  <span className="text-xs font-semibold text-gray-400">
                    not provided
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        <button
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 cursor-pointer"
          onClick={() => nav("/account/profile/edit")}
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Wallet className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <h3 className="text-2xl font-bold">₹500</h3>
            </div>
          </div>
          <p className="text-blue-600 text-sm cursor-pointer">See details →</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Users className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Referrals</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
          <p className="text-blue-600 text-sm cursor-pointer">See details →</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Change Password</h2>
        </div>

        <form className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-3 py-1 border focus:outline-none"
              placeholder="Enter new password"
              disabled={otpSent}
            />
            {errors.newPassword && <ErrorMessage elem={errors.newPassword} />}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className="w-full px-3 py-1 border focus:outline-none"
              placeholder="Confirm new password"
              disabled={otpSent}
            />
            {errors.confirmPassword && (
              <ErrorMessage elem={errors.confirmPassword} />
            )}
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSubmit(handleOtpSent)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              {loading ? "Loading... " : "Send OTP to Email"}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-700">
                  OTP has been sent to {user?.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "OTP must be 6 digits",
                    },
                  })}
                  className="w-full px-3 py-1 border focus:outline-none"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
                <ErrorMessage elem={errors.otp} />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmit(handlePasswordReset)}
                  className="px-3 py-2 bg-green-600 text-white text-sm hover:bg-green-700 transition-colors"
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
