import { User } from "lucide-react"
import { useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast";
import { verifyAdmin } from "../../Services/admin.api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {

    const { register, handleSubmit, reset, formState } = useForm();
    const token = localStorage.getItem("adminToken");
    const nav = useNavigate();

    useEffect(() => {
        if (token) {
            nav("/admin", { replace: true });
        }
    }, [nav, token]);

    const submit = async (data) => {

        let res = await verifyAdmin(data);

        if (res.data.success) {
            toast.success("login success", {
                iconTheme: {
                    primary: "#000",
                    secondary: "#fff",
                }
            });

            localStorage.setItem("adminToken", res.data.token);

            nav("/admin/dashboard", { replace: true });

        } else {
            toast.error("Invalid Credentials", {
                iconTheme: {
                    primary: "#000",
                    secondary: "#fff",
                }
            })
        }
        reset();
    }



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 box-content">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="bg-white rounded-md border p-8 w-full max-w-sm">
                <div className="text-center mb-5">
                    <h1 className="text-xl font-bold text-gray-900">slick</h1>
                    <p className="text-xs text-green-700 font-bold">Admin Portal</p>
                </div>

                <div className="mb-5">
                    <h2 className="text-lg font-semibold text-gray-900 text-center">Welcome back</h2>
                    <p className="text-xs text-gray-500 text-center">Sign in to your admin account</p>
                </div>

                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter you Mail"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                            {...register("email", { required: "field is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid mail" } })}
                        />
                        <p className="text-[11px] text-red-400 ml-2.5">{formState.errors.email?.message ? `${formState.errors.email?.message}` : null}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                {...register("password", { required: "field is required" })}
                            />
                            <p className="text-[11px] text-red-400 ml-2.5">{formState.errors.password?.message ? `${formState.errors.password?.message}` : null}</p>
                            <button
                                type="button"
                                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                            ></button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-[10px] text-gray-400 mt-5">
                    Protected by enterprise-grade security
                </p>

                <div className="flex justify-center mt-5 text-xs text-gray-500">
                    <p>Need help?</p>
                    <button className="ml-1 text-black font-medium hover:underline">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>

    )
}