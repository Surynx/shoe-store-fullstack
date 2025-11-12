import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../Services/userApi';
import toast from 'react-hot-toast';

function ResetPassword() {

    const { handleSubmit,reset,register,formState } = useForm();
    const nav = useNavigate();

    const submit = async(data)=>{

        const { newpassword,confirmpassword } = data;
        
        if(newpassword == confirmpassword) {

            try{
            let res= await resetPassword({newpassword,email:localStorage.getItem("userEmail")});

            toast.success("Reset Successfully!");
            localStorage.removeItem("userEmail");
            nav("/login");

            }catch(err) {
                toast.error(err.response.data.message);
            }

        }else {
            toast.error("Password Doesn't Match");
        }

        
    }


    return (
        <div className="flex items-center justify-center bg-gray-50">
            <div className="bg-white w-full max-w-md p-8 rounded-xl border text-xs font-bold text-center">
                <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                <p className="text-gray-600 text-sm mb-6">
                    Enter your new password below
                </p>

                <form className="space-y-5" onSubmit={handleSubmit(submit)}>
                    <div className="text-left">
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            {...register("newpassword",{required:"filed is required"})}
                        />
                        <p className="text-[11px] text-red-400 ml-2.5">{formState.errors.newpassword?.message ? `${formState.errors.newpassword?.message}` : null}</p>
                    </div>

                    <div className="text-left">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            {...register("confirmpassword",{required:"field is required"})}
                        />
                        <p className="text-[11px] text-red-400 ml-2.5">{formState.errors.confirmpassword?.message ? `${formState.errors.confirmpassword?.message}` : null}</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer"
                    >
                        Reset Password
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-6">
                    Remember your password?{" "}
                    <a href="/login" className="font-semibold text-black hover:underline" onClick={()=>nav("/login")}>
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}


export default ResetPassword