import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { verifyEmail, verifyUser } from "../../Services/user.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { generateOtp } from "../../Services/otp.api";
import Countdown from "react-countdown";

function Verify() {


  useEffect(()=>{

    if(!localStorage.getItem("flow")) {
      nav("/login");
    }

    return ()=> {

      localStorage.removeItem("flow");
      localStorage.removeItem("endTime");
    }
  },[]);

  const { register, handleSubmit, reset } = useForm();
  const nav = useNavigate();

  const endTime = localStorage.getItem("endTime");

  const continueTime = endTime ? Number(endTime) : Date.now() + 60000;

  const [timer,setTimer]= useState(continueTime);

  if (!endTime) {
    localStorage.setItem("endTime", continueTime);
  }

  const submit = async (data) => {
    
    let array_otp = Object.values(data);
    let otp = array_otp.join("");
    let email = localStorage.getItem("verifyEmail");
    try {
      let res = await verifyEmail({ otp, email });

      if (res.data.success) {
        await verifyUser({ email });

        localStorage.removeItem("verifyEmail");
        localStorage.removeItem("endTime")
        toast.success(res.data.message);

        const flow = localStorage.getItem("flow");

        if (flow == "forgot") {
          nav("/resetpassword", { replace: true });
        } else if (flow == "signup") {
          nav("/login",{replace:true});
        }

        localStorage.removeItem("flow");
      }
    } catch (error) {

      toast.error(error.response.data.message);
    }
  };

  const handleResend = async () => {
    let email = localStorage.getItem("verifyEmail");
    await generateOtp({ email });
    reset();

    const newEndTime= Date.now()+60000;
    localStorage.setItem("endTime",newEndTime);
    setTimer(newEndTime);

  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 w-[90%] max-w-md text-left text-sm font-sans">
        <h2 className="text-2xl font-semibold mb-2">Verify Your Email</h2>
        <p className="text-gray-600 mb-8">
          We've sent a verification code to your email address. Please enter the
          code below.
        </p>

        <form onSubmit={handleSubmit(submit)}>
          <div className="flex justify-center gap-3 mb-6">
            <input
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              {...register("one")}
            />
            <input
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              {...register("two")}
            />
            <input
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              {...register("three")}
            />
            <input
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              {...register("four")}
            />
            <input
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              {...register("five")}
            />
            <input
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              {...register("six")}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 rounded hover:bg-gray-800 transition cursor-pointer"
          >
            Verify Email
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
          Didn’t receive the code?{" "}
          {
            <Countdown
              key={timer}
              date={ Number(timer) }
              renderer={({ seconds, completed }) => {

                if (completed) {
                  return (
                    <button
                      className="text-black font-medium hover:underline cursor-pointer"
                      onClick={handleResend}
                    >
                      Resend OTP
                    </button>
                  );
                }else {
                    return(
                        <span className="text-red-400 font-bold text-sm">
                            00:{seconds}
                        </span>
                    )
                }
              }}
            />
          }
        </div>
      </div>
    </div>
  );
}

export default Verify;
