import { useQuery } from "@tanstack/react-query";
import { nav } from "framer-motion/client";
import { ArrowDownCircle, ArrowUpCircle, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWalletInfo } from "../../Services/user.api";

export default function Wallet() {
  const nav = useNavigate();

  const { data } = useQuery({
    queryKey: ["wallet-info"],
    queryFn: getWalletInfo,
  });

  const walletBalance = data?.data?.balance || 0;

  const transactions = data?.data?.transactionHistory || [];

  const lastTransactionAt = data?.data?.lastTransactionAt;
  console.log(lastTransactionAt);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold mb-4">My Wallet</h1>

      <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-black p-5 rounded-sm shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-300 text-xs mb-1">Available Balance</p>
            <h2 className="text-white text-3xl font-bold mb-1">
              ₹{walletBalance.toFixed()}
            </h2>
            <p className="text-xs text-red-300 font-sans">
              last transaction at :{" "}
              {new Date(lastTransactionAt)?.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            className="cursor-pointer flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-sm transition-colors text-xs"
            onClick={() => nav("/account/wallet/addmoney")}
          >
            <Plus className="w-4 h-4" />
            Add Money
          </button>
        </div>
      </div>

      <div className="bg-white p-6">
        <h3 className="text-lg font-bold mb-4">Transaction History</h3>

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 text-xs font-sans">
                No transactions yet
              </p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      transaction.transaction_type === "credited"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.transaction_type === "credited" ? (
                      <ArrowDownCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <ArrowUpCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-sans text-gray-900 text-sm">
                      {transaction.reason}
                      {transaction.orderId ? (
                        <span
                          className="px-2 ml-3 py-0.5 bg-gray-100 
                      rounded text-xs font-sans text-gray-700"
                        >
                          #{transaction.orderId}
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                    <p className="text-sm text-gray-500 text-xs">
                      {new Date(transaction.createdAt)?.toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-bold text-sm ${
                    transaction.transaction_type === "credited"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.transaction_type === "credited" ? "+" : "-"}₹
                  {transaction?.amount?.toFixed()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
