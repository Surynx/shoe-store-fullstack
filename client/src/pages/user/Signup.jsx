import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../Services/user.api";
import toast from "react-hot-toast";
import { generateOtp } from "../../Services/otp.api";
import ErrorMessage from "../../components/admin/ErrorMessage";
import { useState } from "react";

export default function Signup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const nav = useNavigate();
  const [hasReferral, setHasReferral] = useState(null);

  const onSubmit = async (data) => {
    if (data.password != data.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      let res = await registerApi(data);

      if (res.data.success) {
        localStorage.setItem("verifyEmail", data.email);
        localStorage.setItem("flow", "signup");

        reset();
        toast("Please Verify Your Mail", {
          icon: "📩",
        });

        await generateOtp({ email: data.email });

        nav("/verify", { replace: true });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center px-4">
      <div className="flex gap-8 w-full max-w-5xl">
        <div className="bg-white p-4 text-sm flex-1">
          <h2 className="text-2xl font-sans text-left mb-3">
            Don't Have an Account?
          </h2>
          <p className="mb-8">Please signup to create account</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                {...register("name", {
                  required: "field is required",
                  pattern: {
                    value: /^[A-Za-z&\-'. ]{2,50}$/,
                    message: "Invalid Name",
                  },
                })}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black rounded-md"
              />
              <ErrorMessage elem={errors?.name} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                })}
                placeholder="Enter your email"
                className="w-full border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black rounded-md"
              />
              <ErrorMessage elem={errors?.email} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                {...register("password", {
                  required: "Field is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,20}$/,
                    message: "Not Strong One..!",
                  },
                })}
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black rounded-md"
              />
              <ErrorMessage elem={errors.password} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword", {
                  required: "Field is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,20}$/,
                    message: "Not Strong One..!",
                  },
                })}
                type="password"
                placeholder="Confirm your password"
                className="w-full border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black rounded-md"
              />
              <ErrorMessage elem={errors?.confirmPassword} />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 hover:bg-gray-900 transition-colors cursor-pointer rounded-md mt-6"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => nav("/login", { replace: true })}
              className="text-black font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>

        <div className="p-8 text-sm w-80">
          <h3 className="text-xl font-sans mb-4">Join with a Friend?</h3>
          <p className="text-gray-600 mb-6">
            Did someone refer you to our platform? Enter their referral code
            below!
          </p>

          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">
              Do you have a referral code?
            </p>

            <div className="flex gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasReferral}
                  onChange={(e) => setHasReferral(e.target.checked)}
                  className="w-3 h-3 border-gray-300 cursor-pointer outline-none border-none"
                />
                <span className="text-sm font-medium text-gray-700">Yes</span>
              </label>
            </div>

            {hasReferral === true && (
              <div className="mt-4 animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Great! Enter the code
                </label>
                <input
                  {...register("referralCode", {
                    required: hasReferral
                      ? "Please enter the referral code"
                      : false,
                    pattern: {
                      value: /^[A-Z0-9]{6,12}$/,
                      message: "Invalid referral code format",
                    },
                  })}
                  type="text"
                  placeholder="CODE"
                  className="w-full border border-gray-300  px-3 py-1 focus:outline-none focus:ring-1 focus:ring-black uppercase bg-white"
                />
                <ErrorMessage elem={errors?.referralCode} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
