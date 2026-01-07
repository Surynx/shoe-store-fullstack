import { FaPlus } from "react-icons/fa";
import AddBannerModal from "../../components/admin/modal/Banner";
import { useState } from "react";
import BannerList from "../../components/admin/BannerList";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { getAllBanners } from "../../Services/admin.api";
import SearchBox from "../../components/admin/SearchBox";

function BannerManagment() {

  const [openModal, setOpenModal] = useState(false);

  const { data,isLoading } = useQuery({
    queryKey:["banner-list"],
    queryFn:()=>getAllBanners()
  });

  const banners = data?.data?.bannerDocs || [];

  return (
    <>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Banner Management
            </h1>
            <h6 className="text-xs font-md mt-2">
              Available Banners : <span className="font-semibold">{data?.data?.bannerDocs?.length}</span>
            </h6>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="cursor-pointer flex items-center bg-green-800 text-white px-3 py-2 rounded-md hover:bg-green-900 transition text-xs font-bold"
          >
            <FaPlus /> Add New Banner
          </button>
        </div>
    
        <BannerList banners={banners}/>
        <AddBannerModal isOpen={openModal} onClose={() => setOpenModal(false)} />
      </div>
    </>
  );
}

export default BannerManagment;
