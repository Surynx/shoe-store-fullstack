import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../Services/user.api';
import toast from 'react-hot-toast';
import ErrorMessage from '../../components/admin/ErrorMessage';

function ResetPassword() {

    const { handleSubmit,reset,register,formState:{errors} } = useForm();
    const nav = useNavigate();

    const submit = async(data)=>{

        const { newpassword,confirmpassword } = data;
        
        if(newpassword == confirmpassword) {

            try{
            let res= await resetPassword({newpassword,email:localStorage.getItem("userEmail")});

            toast.success("Reset Successfully!");
            localStorage.removeItem("userEmail");
            
            nav("/login",{replace:true});

            }catch(err) {
                toast.error(err.response.data.message);
            }

        }else {
            toast.error("Password Doesn't Match");
        }

        
    }


    return (
        <div className="flex items-center justify-center">
            <div className="bg-white w-full max-w-md p-8 text-sm font-sans text-left">
                <h2 className="text-2xl font-bold mb-2">Reset Password ?</h2>
                <p className="text-gray-600 text-sm mb-8">
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
                            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black rounded-md"
                            {...register("newpassword",{
                                required: "Field is required", pattern: {value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                                   
                                    message: "Not Strong One..!"
                                }})}
                        />
                        <ErrorMessage elem={errors?.newpassword}/>
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
                            className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black rounded-md"
                            {...register("confirmpassword",{
                                required: "Field is required", pattern: {value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                                   
                                    message: "Not Strong One..!"
                                }})}
                        />
                        <ErrorMessage elem={errors?.confirmpassword}/>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 font-medium hover:bg-gray-800 transition cursor-pointer rounded-md"
                    >
                        Reset Password
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-6 text-center">
                    Remember your password?{" "}
                    <a href="/login" className="font-semibold text-black hover:underline" onClick={()=>nav("/login",{replace:true})}>
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}


export default ResetPassword