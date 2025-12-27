import { Loader, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";

import {
  editUserInfo,
  sendOtpToEmail,
  sentOtpToPhone,
  verifyEmailOtp,
  verifyPhone,
} from "../../Services/user.api";

import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function EditProfile() {
  
  const handleProfileInfo = useForm();
  const handlePhoneUpdate = useForm();
  const handleEmailUpdate = useForm();

  const nav = useNavigate();

  const QueryClient = useQueryClient();

  const { data } = useOutletContext();

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  const [phone, setPhone] = useState(null);
  const [email,setEmail] = useState(null);

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      let user = data?.data?.userInfo;
      setPreview(user?.profile_picture);

      handleProfileInfo.reset({
        name: user?.name,
        gender: user?.gender,
      });

      handlePhoneUpdate.reset({
        phone: user?.phone,
      });

      handleEmailUpdate.reset({
        email: user?.email,
      });
    }
  }, [data]);

  const handleAvatar = (file) => {
    if (file) {
      setAvatar(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleProfileSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();

    formData.append("profile_picture", avatar);
    formData.append("name", data.name);
    formData.append("gender", data.gender);

    const res = await editUserInfo(formData);

    setLoading(false);

    if (res) {
      toast.success(res.data.message);
      QueryClient.invalidateQueries("userInfo");
    }
  };

  const handleOptsent = async () => {

    const phone = handlePhoneUpdate.getValues("phone");
    setPhone(phone);

    if (phone && String(phone).length == 10) {
      
      setPhoneOtpSent(true);
      let res = await sentOtpToPhone({ phone });

      if (res?.data?.success) {
        toast.success(`Otp Sent to ${phone}`);
      }
    } else {
      toast.error("Number is not Valid");
    }
  };

  //phone update

  const handlePhoneVerify = async () => {
    const otp = handlePhoneUpdate.getValues("otp");

    if (otp.length == 6) {
      try {
        let res = await verifyPhone({ phone, otp });

        if (res?.data?.success) {
          setPhoneVerified(true);
        }
      } catch (error) {
        toast.error("Invalid Otp");
      }
    } else {
      toast.error("Required 6 Digits!");
    }
  };

  //email update

  const handleEmailOtpSend = async () => {

    const email = handleEmailUpdate.getValues("email");
    setEmail(email);

    if (!email || !email.includes("@")) {
      return toast.error("Enter a valid email");
    }

    setEmailOtpSent(true);

    try {
      const res = await sendOtpToEmail({ email });

      if (res?.data?.success) {
        toast.success(`OTP sent to ${email}`);
      } else {
        toast.error("Failed to send OTP");
        setEmailOtpSent(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setEmailOtpSent(false);
    }
  };

  const handleEmailVerify = async () => {

    const otp = handleEmailUpdate.getValues("otp");

    if (!otp || otp.length !== 6) {
      return toast.error("Required 6 digits!");
    }

    try {
      const res = await verifyEmailOtp({ email, otp });

      if (res?.data?.success) {

        setEmailVerified(true);

        toast.success("Email updated!");
        toast.success("Please Login");
        localStorage.removeItem("userToken");
        nav("/login");

      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-6  p-6">
        <form onSubmit={handleProfileInfo.handleSubmit(handleProfileSubmit)}>
          <div className="space-y-5 border p-5 rounded-xl">
            <h2 className="text-lg font-semibold">Update Information</h2>
            <div className="flex items-center gap-4">
              <img
                src={preview}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />

              <label className="cursor-pointer text-blue-600 hover:text-blue-700">
                <span className="flex items-center gap-1 text-sm font-medium">
                  <UploadCloud size={18} />
                  Upload photo
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleAvatar(e.target.files[0])}
                />
              </label>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full px-3 py-2 border focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                {...handleProfileInfo.register("name")}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Gender
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    className="cursor-pointer"
                    {...handleProfileInfo.register("gender")}
                  />
                  Male
                </label>

                <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    className="cursor-pointer"
                    {...handleProfileInfo.register("gender")}
                  />
                  Female
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 font-medium bg-blue-700 text-white hover:bg-blue-700 text-sm transition-colors cursor-pointer"
              >
                {loading ? (
                  <span className="flex">
                    Saving
                    <Loader className="pt-1 animate-pulse" size={18} />
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-4 border p-5 rounded-xl">
          <h2 className="text-lg font-semibold">Email Verification</h2>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-72 px-3 py-2 border focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                {...handleEmailUpdate.register("email")}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEmailOtpSend();
                }}
                disabled={emailOtpSent}
                className={`px-4 py-2 font-medium rounded-lg text-sm whitespace-nowrap transition-colors ${
                  emailOtpSent
                    ? "text-gray-500 text-xs font-bold cursor-not-allowed"
                    : "text-gray-700 text-xs font-bold hover:cursor-pointer"
                }`}
              >
                {emailOtpSent ? "OTP Sent ✔️" : "Send OTP ?"}
              </button>
            </div>
          </div>

          {emailOtpSent && !emailVerified && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Enter OTP
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="------"
                  maxLength="6"
                  className="w-32 px-3 py-2 border focus:ring-2 focus:ring-blue-200 outline-none text-sm text-center tracking-widest"
                  {...handleEmailUpdate.register("otp")}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleEmailVerify();
                  }}
                  className="px-3 py-2 font-medium bg-green-700 text-white hover:bg-green-800 text-xs transition-colors cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {emailVerified && (
            <div className="text-sm text-green-600 font-medium">
              ✓ Email Updated successfully
            </div>
          )}
        </div>

        <form>
          <div className="space-y-4 border p-5 rounded-xl">
            <h2 className="text-lg font-semibold">Phone Verification</h2>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-72 px-3 py-2 border focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                  {...handlePhoneUpdate.register("phone")}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleOptsent();
                  }}
                  disabled={phoneOtpSent}
                  className={`px-2 py-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    phoneOtpSent
                      ? "text-gray-500 text-xs font-bold cursor-not-allowed"
                      : "text-gray-700 text-xs font-bold hover:cursor-pointer"
                  }`}
                >
                  {phoneOtpSent ? "Otp Sent ✔️" : "Send Otp ?"}
                </button>
              </div>
            </div>

            {phoneOtpSent && !phoneVerified && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Enter OTP
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="------"
                    maxLength="6"
                    className="w-32 px-3 py-2 border focus:ring-2 focus:ring-blue-200 outline-none text-sm text-center tracking-widest"
                    {...handlePhoneUpdate.register("otp")}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handlePhoneVerify();
                    }}
                    className="px-3 py-2 font-medium bg-green-700 text-white hover:bg-green-800 text-xs transition-colors cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}

            {phoneVerified && (
              <div className="text-sm text-green-600 font-medium">
                ✓ Phone verified successfully
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
