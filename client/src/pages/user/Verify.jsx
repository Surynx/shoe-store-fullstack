import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { verifyEmail, verifyUser } from '../../Services/userApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { generateOtp } from '../../Services/OtpApi';

function Verify() {

    const { register, handleSubmit,reset } = useForm();
    const nav = useNavigate();

    let [timer,setTimer]=useState(99);
    let interval;

    const submit = async (data) => {

        let array_otp = Object.values(data);
        let otp = array_otp.join("");
        let email = localStorage.getItem("verifyEmail");

        let res = await verifyEmail({ otp, email });

        if (res.data.success) {

            await verifyUser({email});

            localStorage.removeItem("verifyEmail");
            toast.success(res.data.message);

            if(localStorage.getItem("userEmail")) {

                nav("/resetpassword");

            }else {

                 nav("/login");

            }
        } else {
            toast.error(res.data.message);
        }

    }

    const handleResend= async ()=>{

        let email=localStorage.getItem("verifyEmail");
        await generateOtp({email});
        reset();
    }

    useEffect(()=>{
        interval = setInterval(()=>{
          setTimer((p)=>p-1);
        },1000);

    },[]);

    if(timer<=0) {
        clearInterval(interval);
    }

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 w-[90%] max-w-md text-center border text-xs font-bold">
                <h2 className="text-2xl font-semibold mb-2">Verify Your Email</h2>
                <p className="text-gray-600 mb-6">
                    We've sent a verification code to your email address. Please enter the code below.
                </p>

                <form onSubmit={handleSubmit(submit)}>
                    <div className="flex justify-center gap-3 mb-6">
                        <input type="text" maxLength="1" className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            {...register("one")} />
                        <input type="text" maxLength="1" className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            {...register("two")} />
                        <input type="text" maxLength="1" className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            {...register("three")} />
                        <input type="text" maxLength="1" className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            {...register("four")} />
                        <input type="text" maxLength="1" className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            {...register("five")} />
                        <input type="text" maxLength="1" className="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            {...register("six")} />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-800 transition cursor-pointer"
                    >
                        Verify Email
                    </button>
                </form>

                <div className="mt-4 text-sm text-gray-600">
                    Didn’t receive the code?{" "}
                    {(timer >= 0) ?
                    <span className='text-red-400 font-bold text-sm'>...{timer}</span> 
                    :
                    <button
                        className="text-black font-medium hover:underline cursor-pointer"
                        type="button"
                        onClick={handleResend}
                    >
                        Resend OTP
                    </button>}
                </div>
            </div>
        </div>
    );


}

export default Verify