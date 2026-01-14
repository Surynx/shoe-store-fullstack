import { Edit, Wallet, Users, Lock, Mail, LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ReferralModal from "./modal/Referal";

export default function UserInfo() {

  const { data } = useOutletContext();

  const [user, setUser] = useState();
  const [ totalReferral,setTotalReferral ]= useState();
  const [walletBalance,setWalletBalance]= useState(0);

  const nav = useNavigate();

  const [loading, setLoading] = useState(false);

  const [ openModal,setOpenModal ]= useState(false);

  useEffect(() => {
    if (data) {

      setUser(data.data.userInfo);
      setTotalReferral(data.data.referralCount);
      setWalletBalance(data.data.balance || 0);
    }
  }, [data]);

  return (
    <div className="space-y-6 mt-5">
      <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between relative">
        <div>
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Email Address</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone Number</p>
              <p className="font-medium">
                {user?.phone ? (
                  user.phone
                ) : (
                  <span className="font-semibold text-xs text-gray-400">
                    not provided
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Member Since</p>
              <p className="font-medium">
                {new Date(user?.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Gender</p>
              <p className="font-medium">
                {user?.gender ? (
                  user.gender
                ) : (
                  <span className="text-xs font-semibold text-gray-400">
                    not provided
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        <button
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 cursor-pointer"
          onClick={() => nav("/account/edit")}
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Wallet className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <h3 className="text-2xl font-bold">₹{walletBalance.toFixed()}</h3>
            </div>
          </div>
          <p className="text-blue-600 text-sm cursor-pointer" onClick={()=>nav("/account/wallet")}>See details →</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Users className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Referrals</p>
              <h3 className="text-2xl font-bold">{totalReferral}</h3>
            </div>
          </div>
          <p className="text-blue-600 text-sm cursor-pointer" onClick={()=>setOpenModal(true)}>See details →</p>
        </div>
      </div>
      <ReferralModal isOpen={openModal} onClose={()=>setOpenModal(false)} referralCode={user?.referral_code} totalReferrals={totalReferral}/>
    </div>
  );
}