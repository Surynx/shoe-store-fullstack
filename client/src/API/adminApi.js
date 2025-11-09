import { data } from "react-router-dom";
import api from "./axios";


const verifyAdmin=async(data)=>{
    const res = await api.post("/admin/verify",data);
    return res;
}

const getAllusers= async ()=>{

    const token=localStorage.getItem("adminToken");

    const res=await api.get("/admin/users",{
        headers:{
            authorization:`Bearer ${token}`
        }
    });
    return res;
}

const blockUser= async(data)=> {

    const token=localStorage.getItem("adminToken");

    let res= await api.patch('admin/block-user',data,{
        headers:{
            authorization:`Bearer ${token}`
        }
    });

    return res;
}



export { verifyAdmin,getAllusers,blockUser }