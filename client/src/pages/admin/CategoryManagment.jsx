import { FaPlus } from "react-icons/fa";
import SearchBox from "../../components/admin/SearchBox";
import CategoryTable from "../../components/admin/Tables/CategoryTable";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/admin/Pagination";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCategory } from "../../Services/admin.api";
import useDebounce from "../../hooks/useDebounce";

function CategoryManagment() {

  const nav = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debounce = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ["CategoryInfo", debounce, page],
    queryFn: () => getAllCategory(debounce, page),
    keepPreviousData: true,
  });

  const limit = data?.data.limit;
  const total_doc = data?.data.total_doc;

  const totalPages = Math.ceil(total_doc / limit) || 1;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Category Management
        </h1>
        <h6 className='text-xs font-md mt-2'>Available Category: <span className='font-semibold'>{data?.data?.docs?.length}</span></h6>
        </div>
        <button
          onClick={() => nav("/admin/category/add")}
          className="cursor-pointer flex items-center bg-green-800 text-white px-3 py-2 rounded-md hover:bg-green-900 transition text-xs font-bold"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      <SearchBox search={search} setSearch={setSearch} />

      <CategoryTable docs={data} isLoading={isLoading} />

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}

export default CategoryManagment;
