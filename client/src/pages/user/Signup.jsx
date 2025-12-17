import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../Services/user.api";
import toast from "react-hot-toast";
import { generateOtp } from "../../Services/otp.api";
import ErrorMessage from "../../components/admin/ErrorMessage";

export default function Signup() {

    const { register, handleSubmit, reset, formState:{errors} } = useForm();
    const nav = useNavigate();

    const onSubmit = async (data) => {

        if (data.password != data.confirmPassword) {

            return toast.error("Passwords do not match!")
        }

        let res = await registerApi(data);

        if (res.data.success) {

            localStorage.setItem("verifyEmail", data.email);
            localStorage.setItem("flow","signup");

            reset();
            toast('Please Verify Your Mail', {
                icon: '📩',
            });
            await generateOtp({email:data.email});
            nav("/verify");

        } else {

            toast.error("Email Already Exist!");
        }

    };

    return (
        <div className="flex justify-center items-center px-4">
            <div className="bg-white p-8 text-sm w-full max-w-sm">
                <h2 className="text-2xl font-sans text-left mb-3">Don't Have an Account?</h2>
                <p className="mb-8">Please signup to create acunt</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            {...register("name",{ required: "field is required" ,pattern:{value:/^[A-Za-z&\-'. ]{2,50}$/,message:"Invalid Name"}})}
                         
                            placeholder="Enter your full name"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                        <ErrorMessage elem={errors?.name}/>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            {...register("email",{required:"Empty filed"})}
                           
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                        <ErrorMessage elem={errors?.email}/>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            {...register("password", {
                                required: "Field is required", pattern: {value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                                    
                                    message: "Not Strong One..!"
                                }
                            })}
                            type="password"
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                        <ErrorMessage elem={errors.password}/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            {...register("confirmPassword", {
                                required: "Field is required", pattern: {value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                                   
                                    message: "Not Strong One..!"
                                }
                            })}
                            type="password"
                            placeholder="Confirm your password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                        <ErrorMessage elem={errors?.confirmPassword}/>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition-colors cursor-pointer"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <span onClick={() => nav("/login",{replace:true})} className="text-black font-medium cursor-pointer hover:underline">
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}
