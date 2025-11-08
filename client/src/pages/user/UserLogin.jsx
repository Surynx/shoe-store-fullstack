import React from 'react'
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../../API/userApi';
import toast from 'react-hot-toast';
import { generateOtp } from '../../API/OtpApi';

export default function UserLogin() {

  const { register, handleSubmit, reset } = useForm();
  const nav = useNavigate();

  const onSubmit =  async(data) => {

    try{

      let res=await userLogin(data);

      if(res.data.success) {
        toast.success(res.data.message);
        nav("/")
      }

    }catch(err) {

      let {message} = err.response.data;

      if(message == "notVerified") {

        await generateOtp({email:data.email});
        localStorage.setItem("verifyEmail",data.email);

        nav("/verify");

      }else {

          toast.error(message);
      }

    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
            <p className="text-right text-xs text-gray-500 mt-2 cursor-pointer hover:underline" onClick={()=>nav("/forgotpassword")}>
              Forgot Password?
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition-colors cursor-pointer"
          >
            Login
          </button>
        </form>


        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>


        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition">
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>


        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <span onClick={() => nav("/signup")} className="text-black font-medium cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
