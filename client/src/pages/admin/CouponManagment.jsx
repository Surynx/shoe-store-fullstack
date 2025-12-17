import { FaPlus } from "react-icons/fa";
import Pagination from "../../components/admin/Pagination";
import SearchBox from "../../components/admin/SearchBox";
import { useState } from "react";
import AddCouponModal from "../../components/admin/modal/Coupon";
import CouponTable from "../../components/admin/Tables/CouponTable";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../../hooks/useDebounce";
import { getAllCoupon } from "../../Services/admin.api";

function CouponManagment() {

  const [openModal, setOpenModal] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debounce = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ["coupon-data", debounce, page],
    queryFn: () => getAllCoupon(debounce, page),
  });

  const limit = data?.data?.limit;

  const total = data?.data?.total_doc;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Coupon Management
          </h1>
          <h6 className="text-xs font-semibold mt-2">
            Total Coupon: {data?.data?.docs.length}
            <span className="font-semibold">{}</span>
          </h6>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="cursor-pointer flex items-center bg-green-800 text-white px-3 py-2 rounded-md hover:bg-green-900 transition text-xs font-bold gap-1"
        >
          <FaPlus /> Add Coupon
        </button>
      </div>

      <SearchBox search={search} setSearch={setSearch}/>
      <CouponTable 
        data={data}
        isLoading={isLoading}
        />
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      <AddCouponModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}

export default CouponManagment;
