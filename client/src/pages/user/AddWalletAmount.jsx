import React, { useState } from "react";
import { ArrowLeft, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createRazorpayOrder, getWalletInfo, verifyPayment } from "../../Services/user.api";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AddMoneyPage() {

  const nav = useNavigate();

  const { data } = useQuery({
    queryKey: ["wallet-info"],
    queryFn: getWalletInfo,
  });

  const walletBalance = data?.data?.balance || 0;

  const QueryClient= useQueryClient();

  const [selectedAmount, setSelectedAmount] = useState(5000);

  const amountOptions = [100, 500, 1000, 2000, 5000];

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
  };

  const handleAddMoney = async () => {
    try {
      
      const res = await createRazorpayOrder({ amount: selectedAmount });

      if (res && res.data.success) {
        const order = res.data.order;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Comet",
          description: "Add Money to Wallet",
          order_id: order.id,

          handler: async(response)=> {
            try{

              const res= await verifyPayment(response);

              if(res && res.data.success) {
                
                toast.success(res.data.message);
                nav("/account/wallet");
              }

            }catch(error) {
                toast.error(error.response.data.message);
            }
          },

          theme: {
            color: "#0f172a",
          },
        };

        const razorpay= new window.Razorpay(options);
        razorpay.open();

      }
    } catch (error) {

      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-7">
        <button
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-8 cursor-pointer"
          onClick={() => nav("/account/wallet")}
        >
          <ArrowLeft size={16} />
          <span>Back to Wallet</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Money</h1>
        <p className="text-xs text-gray-600 font-sans">
          Choose an amount to add to your wallet
        </p>
      </div>

      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-md p-5 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-300 text-xs mb-1">Current Balance</p>
            <p className="text-3xl font-bold">₹{walletBalance.toFixed()}</p>
          </div>
          <Wallet size={36} className="text-slate-300" />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm text-gray-900 font-semibold mb-3">
          Select Amount
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          {amountOptions.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountClick(amount)}
              className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                selectedAmount === amount
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-gray-700 border-gray-800 hover:border-gray-900"
              }`}
            >
              ₹ {amount}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 p-4 mb-5 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-900">Total Amount</span>
          <span className="text-sm font-bold text-gray-900">
            ₹ {selectedAmount}
          </span>
        </div>
      </div>

      <button
        className="w-full bg-slate-800 text-white py-3.5 rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors mb-2 cursor-pointer"
        onClick={handleAddMoney}
      >
        Add ₹ {selectedAmount} to Wallet
      </button>

      <p className="text-center text-[10px] font-sans text-gray-500 flex items-center justify-center gap-1">
        🔒 Your payment information is secure and encrypted
      </p>
    </div>
  );
}
