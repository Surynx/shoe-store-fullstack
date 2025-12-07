import SearchBox from "../../components/admin/SearchBox";
import Pagination from "../../components/admin/Pagination";
import OrderTable from "../../components/admin/OrderTable";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../Services/admin.api";
import useDebounce from "../../hooks/useDebounce";

function OrderManagement() {
    
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debounce= useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ["order-data", debounce, page],
    queryFn: () => getAllOrders(debounce, page),
  });

  const limit = data?.data?.limit;

  const total = data?.data?.total_doc;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <h6 className="text-xs font-md mt-2">
            Total Orders:{" "}
            <span className="font-semibold">{}</span>
          </h6>
        </div>
      </div>

      <SearchBox search={search} setSearch={setSearch} />
      <OrderTable
        data={data}
        isLoading={isLoading}
      />
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}

export default OrderManagement;
