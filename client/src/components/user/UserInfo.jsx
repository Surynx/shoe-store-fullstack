import { Edit, Wallet, Users } from "lucide-react";

export default function UserInfo() {
    
  return (
    <div className="space-y-6">

      <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="font-medium">John Doe</p>
            </div>
            <div>
              <p className="text-gray-500">Email Address</p>
              <p className="font-medium">john.doe@example.com</p>
            </div>
            <div>
              <p className="text-gray-500">Phone Number</p>
              <p className="font-medium">+1 (123) 456-7890</p>
            </div>
            <div>
              <p className="text-gray-500">Member Since</p>
              <p className="font-medium">January 15, 2023</p>
            </div>
            <div>
              <p className="text-gray-500">Gender</p>
              <p className="font-medium">Male</p>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
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
              <h3 className="text-2xl font-bold">₹500</h3>
            </div>
          </div>
          <p className="text-blue-600 text-sm cursor-pointer">See details →</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Users className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Referrals</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
          <p className="text-blue-600 text-sm cursor-pointer">See details →</p>
        </div>
      </div>
    </div>
  );
}
