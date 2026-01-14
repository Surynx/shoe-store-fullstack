import "@fortawesome/fontawesome-free/css/all.min.css";
import { useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { blockUser } from "../../../Services/admin.api";


function UserTable({data,isLoading}) {

  const QueryClient = useQueryClient();

  const userInfo= data?.data?.userDocs || [];

  const handleBlock= async(user)=>{
      
      let {isConfirmed} = await Swal.fire({
          text:(user.isBlock) ? "UnBlock User?" : "Block User",
          icon:'warning',
          iconColor:'black',
          showCancelButton:true,
          cancelButtonColor:"grey",
          width:"320px",
          confirmButtonColor:"#d90000",
          confirmButtonText:(user.isBlock) ? "Unblock" : "Block",
        });

        if(isConfirmed) {
            let res= await blockUser({id:user._id,isBlock:user.isBlock});

            if(res.data.success) {
              console.log(res);
              QueryClient.invalidateQueries("UsersInfo");

              let message = (!user.isBlock) ? `${user.name}-blocked` : `${user.name}-unblocked`;
              toast.warn(message);
            }
        }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.2s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.4s]"></div>
      </div>
    );
  }

  return (
      <div className="bg-white border border-gray-200 min-h-screen">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 font-medium text-xs uppercase">
            <tr>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Email Verification</th>
              <th className='py-3 px-6 text-left'>Phone</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Join Date</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {userInfo.length > 0 ? (
              userInfo.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-green-800 text-xs font-semibold">{user.email}</p>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${user.isVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                        }`}
                    >
                      {user.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                   <td className="py-4 px-6 text-gray-600">
                    {user.phone ? user.phone : <span className='text-xs font-bold text-gray-400'>Not Provided</span>}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${user.isBlock
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-700"
                        }`}
                    >
                      {user.isBlock ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-gray-600 font-bold text-xs">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <button className='text-lg cursor-pointer' onClick={()=>handleBlock(user)}>
                      {user.isBlock ? (
                        <i className="fa-solid fa-check text-green-500 cursor-pointer"></i>
                      ) : (
                        <i className="fa-solid fa-ban text-red-500"></i>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-400 text-sm italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  );
}

export default UserTable;