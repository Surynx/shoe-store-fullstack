import api from "./config/Api";

const generateOtp = async(data)=> {
    let res=await api.post("/user/generateotp",data);
    return res;
}

export {generateOtp}