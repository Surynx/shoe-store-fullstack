import { useForm } from "react-hook-form"
import { generateOtp } from "../../Services/otp.api";
import { useNavigate } from "react-router-dom";


function ForgetPassword() {

    const { register,formState,handleSubmit } = useForm();
    const nav = useNavigate();

    const submit= async (data)=>{
        
        localStorage.setItem("verifyEmail",data.email);
        localStorage.setItem("userEmail",data.email);

        await generateOtp({email:data.email});

        nav("/verify");
    }

    return (
        <div className="flex items-center justify-center bg-gray-50">
            <div className="bg-white w-full max-w-md p-8 rounded-xl border text-xs font-bold text-center">
                <h2 className="text-2xl font-bold mb-2">Forgot Your Password?</h2>
                <p className="text-gray-600 text-sm mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form className="space-y-5" onSubmit={handleSubmit(submit)}>
                    <div className="text-left">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            {...register("email")}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition cursor-pointer"
                    >
                        Verify Mail
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-6">
                    Remember your password?{" "}
                    <a href="/login" className="font-semibold text-black hover:underline" onClick={()=>nav("/login")}>
                        login
                    </a>
                </p>
            </div>
        </div>
    )
}

export default ForgetPassword