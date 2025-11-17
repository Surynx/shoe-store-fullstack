import BrandTable from "../../components/admin/BrandTable";
import { FaPlus } from "react-icons/fa";
import SearchBox from "../../components/admin/SearchBox";
import Pagination from "../../components/admin/Pagination";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllbrand } from "../../Services/admin.api";
import { useState } from "react";

function BrandManagment() {

  const nav= useNavigate();

  const [page,setPage]= useState(1);
  const [search,setSearch] = useState("");
  
  const {data,isLoading} = useQuery({
    queryKey:["BrandInfo",page,search],
    queryFn:()=>getAllbrand(search,page),
    keepPreviousData:true  
  });

  return (
    <>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Brand Management
          </h1>
          <button
          onClick={()=>nav("/admin/brand/add")} 
          className="cursor-pointer flex items-center bg-green-800 text-white px-3 py-2 rounded-md hover:bg-green-900 transition text-xs font-bold">
            <FaPlus /> Add Brand
          </button>
        </div>

        <SearchBox search={search} setSearch={setSearch}/>
        <BrandTable data={data} isLoading={isLoading}/>
        <Pagination page={page} setPage={page} totalPages={page}/>

      </div>
    </>
  );
}

export default BrandManagment;
