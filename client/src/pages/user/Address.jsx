import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Pen, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAddress, getAllAddress } from '../../Services/user.api';
import toast from 'react-hot-toast';

export default function Address() {

  const nav=useNavigate();
  const QueryClient= useQueryClient();

  const { data,isLoading }= useQuery({
    queryKey:["fetchAddress"],
    queryFn:getAllAddress,
    keepPreviousData:true  
    
  });

  const handleDelete= async(id)=> {

    const res= await deleteAddress(id);

    if(res.data.success) {
        toast.success("Address Removed Successfully");
        QueryClient.invalidateQueries("fetchAddress");
    }
  }

  const addresses = data?.data?.docs || [];
  

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Addresses</h1>
        
          <button
            className="flex items-center gap-1 border bg-gray-700 text-white cursor-pointer text-xs px-2 py-1  transition-colors"
            onClick={()=>nav("/account/address/add")}
          >
            <Plus size={20} />
            Add New Address
          </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No addresses added yet</h3>
          <p className="text-gray-500 mb-6">Add your first address to get started</p>
          <button
            className="text-black border px-6 py-2.5 cursor-pointer"
            onClick={()=>nav("/account/address/add")}
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white rounded-md p-5 border hover:shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    {address.isDefault && (
                      <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-700">
                        Default
                      </span>
                    )}
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${
                      address.type === 'Home' 
                        ? 'bg-blue-100 text-blue-700' 
                        : address.type === 'Work'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {address.type}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{address.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{address.phone}</p>
                  
                  <div className="text-gray-700 text-sm leading-relaxed">
                    <p>{address.line1}</p>
                    {address.addressLine2 && <p>{address.line2}</p>}
                    <p>{address.city}, {address.state} - {address.pin_code}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-medium cursor-pointer"
                    onClick={()=>nav(`/account/address/${address._id}`,{state:address})}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    
                    className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-medium cursor-pointer" 
                    onClick={()=>handleDelete(address._id)}
                    
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}