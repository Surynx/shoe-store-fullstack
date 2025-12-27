import { Edit, Wallet, Users, Lock, Mail, LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../admin/ErrorMessage";
import { changePassword } from "../../Services/user.api";
import toast from "react-hot-toast";
import ReferralModal from "./modal/Referal";

export default function UserInfo() {

  const { data } = useOutletContext();

  const [user, setUser] = useState();
  const [ totalReferral,setTotalReferral ]= useState();
  const [walletBalance,setWalletBalance]= useState(0);

  const nav = useNavigate();

  const [loading, setLoading] = useState(false);

  const [ openModal,setOpenModal ]= useState(false);

  const { register, handleSubmit, reset,formState: { errors }, watch} = useForm();

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (data) {

      setUser(data.data.userInfo);
      setTotalReferral(data.data.referralCount);
      setWalletBalance(data.data.balance || 0);
    }
  }, [data]);


  const handlePasswordReset = async (data) => {
    
    try {

      const res = await changePassword(data);

      if (res?.data?.success) {

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
      <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between relative">
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
          onClick={() => nav("/account/edit")}
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
              <h3 className="text-2xl font-bold">₹{walletBalance.toFixed()}</h3>
            </div>
          </div>
          <p className="text-blue-600 text-sm cursor-pointer" onClick={()=>nav("/account/wallet")}>See details →</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Users className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Referrals</p>
              <h3 className="text-2xl font-bold">{totalReferral}</h3>
            </div>
          </div>
          <p className="text-blue-600 text-sm cursor-pointer" onClick={()=>setOpenModal(true)}>See details →</p>
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
              Current Password
            </label>
            <input
              type="password"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              className="w-full px-3 py-1 border focus:outline-none"
              placeholder="Enter current password"
            />
            {errors.currentPassword && (
              <ErrorMessage elem={errors.currentPassword} />
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-3 py-1 border focus:outline-none"
              placeholder="Enter new password"
            />
            {errors.newPassword && <ErrorMessage elem={errors.newPassword} />}
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className="w-full px-3 py-1 border focus:outline-none"
              placeholder="Re-enter new password"
            />
            {errors.confirmPassword && (
              <ErrorMessage elem={errors.confirmPassword} />
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit(handlePasswordReset)}
            className="px-3 py-2 bg-blue-700 text-white text-sm hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>
      <ReferralModal isOpen={openModal} onClose={()=>setOpenModal(false)} referralCode={user?.referral_code} totalReferrals={totalReferral}/>
    </div>
  );
}
