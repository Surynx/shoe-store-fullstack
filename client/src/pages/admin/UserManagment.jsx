import { useQuery } from "@tanstack/react-query";
import Pagination from "../../components/admin/Pagination"
import SearchBox from "../../components/admin/SearchBox"
import UserTable from "../../components/admin/Tables/UserTable"
import { getAllusers } from "../../Services/admin.api";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";

function UserManagment() {

    const [search,setSearch] = useState("");
    const [page,setPage] = useState(1);

    const debounce= useDebounce(search);

    const { data,isLoading,isError } = useQuery({
    queryKey:["UsersInfo",debounce,page],
    queryFn:()=>getAllusers(debounce,page),
    keepPreviousData: true
    
  });

    const limit= data?.data?.limit;
    
    const total= data?.data?.total_doc;
    const totalPages = Math.ceil(total / limit);


  return (
    <>
    <div className="p-8 bg-gray-50">
    <h1 className="text-2xl font-bold">User Managment</h1>
    <h6 className='text-xs font-md mt-2 pb-5'>Total User Account: <span className='font-semibold'>{data?.data?.userDocs?.length}</span></h6>
    <SearchBox search={search} setSearch={setSearch}/>
    <UserTable data={data} isLoading={isLoading}/>
    </div>
    <Pagination page={page} setPage={setPage} totalPages={totalPages}/> 
    </>
  )
}

export default UserManagment