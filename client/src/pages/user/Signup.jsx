import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../Services/userApi";
import toast from "react-hot-toast";
import { generateOtp } from "../../Services/OtpApi";

export default function Signup() {

    const { register, handleSubmit, reset, formState } = useForm();
    const nav = useNavigate();

    const onSubmit = async (data) => {

        if (data.password != data.confirmPassword) {

            return toast.error("Passwords do not match!")
        }

        let res = await registerApi(data);

        if (res.data.success) {

            localStorage.setItem("verifyEmail", data.email);

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
        <div className="flex justify-center items-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-lg border text-sm font-bold w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-8">Sign Up</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>


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
                            {...register("password", {
                                required: "Field is required", pattern: {
                                    
                                    message: "Not Strong One..!"
                                }
                            })}
                            type="password"
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                        <p className="text-[11px] text-red-400 ml-2.5">{formState.errors.password?.message ? `${formState.errors.password?.message}` : null}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            {...register("confirmPassword", {
                                required: "Field is required", pattern: {
                                   
                                    message: "Not Strong One..!"
                                }
                            })}
                            type="password"
                            placeholder="Confirm your password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                        <p className="text-[11px] text-red-400 ml-2.5">{formState.errors.confirmPassword?.message ? `${formState.errors.confirmPassword?.message}` : null}</p>
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
                    <span onClick={() => nav("/login")} className="text-black font-medium cursor-pointer hover:underline">
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}
