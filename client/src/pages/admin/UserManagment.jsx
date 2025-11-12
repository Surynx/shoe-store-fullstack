import { useQuery } from "@tanstack/react-query";
import Pagination from "../../components/admin/Pagination"
import SearchBox from "../../components/admin/SearchBox"
import UserTable from "../../components/admin/UserTable"
import { getAllusers } from "../../Services/adminApi";
import { useState } from "react";

function UserManagment() {

    const [search,setSearch] = useState("");
    const [page,setPage] = useState(1);

    const { data,isLoading,isError } = useQuery({
    queryKey:["UsersInfo",search,page],
    queryFn:()=>getAllusers(search,page),
    keepPreviousData: true
    
  });

    const limit= data?.data?.limit;
    
    const total= data?.data?.total_doc;
    const totalPages = Math.ceil(total / limit);


  return (
    <>
    <div className="p-8 bg-gray-50">
    <h1 className="text-2xl pb-5 font-bold">User Managment</h1>
    <SearchBox search={search} setSearch={setSearch}/>
    <UserTable data={data} isLoading={isLoading}/>
    </div>
    <Pagination page={page} setPage={setPage} totalPages={totalPages}/> 
    </>
  )
}

export default UserManagment