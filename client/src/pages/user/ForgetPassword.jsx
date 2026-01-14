import { useForm } from "react-hook-form";
import { generateOtp } from "../../Services/otp.api";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/admin/ErrorMessage";

function ForgetPassword() {
  const { register, formState:{errors} , handleSubmit } = useForm();
  const nav = useNavigate();

  const submit = async (data) => {

    localStorage.setItem("verifyEmail", data.email);
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("flow", "forgot");

    try{
    await generateOtp({ email: data.email });

    nav("/verify", { replace: true });

    }catch(error) {

      window.alert(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-8 text-sm text-left font-sans">
        <h2 className="text-2xl mb-2">Forgot Your Password?</h2>
        <p className="text-gray-600 text-xs mb-8">
          Enter your email address and we'll send you a link to reset your
          password.
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
              className="w-full border border-gray-300 px-4 py-2 focus:outline-none rounded-md"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            <ErrorMessage elem={errors.email}/>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 font-medium hover:bg-gray-800 transition cursor-pointer rounded-md"
          >
            Verify Mail
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Remember your password?{" "}
          <a
            href="/login"
            className="font-semibold text-black hover:underline"
            onClick={() => nav("/login")}
          >
            login
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgetPassword;
