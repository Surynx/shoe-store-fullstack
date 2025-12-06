import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/user/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../../Services/user.api";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Profile() {
  const nav = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Please Login");
      nav("/login");
    }
  },[isError]);

  return (
    <div className="flex my-25 mx-8">
      <div className="w-1/4 lg:w-1/5 bg-white border ml-3.5 rounded-2xl h-120">
        <Sidebar name={data?.data?.userInfo?.name} email={data?.data?.userInfo?.email} avatar={data?.data?.userInfo?.profile_picture}/>
      </div>

      <div className="flex-1 p-6">
        <Outlet context={{data}}/>
      </div>
    </div>
  );
}
