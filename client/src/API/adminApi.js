import api from "./axios";


export const verifyAdmin=async(data)=>{
    const res = await api.post("/admin/verify",data);
    return res;
}