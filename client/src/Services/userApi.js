import api from "./config/Api";

const registerApi=async (data) => {
    let res = await api.post("/user/register",data);
    return res;
    
}

const verifyEmail=async (data)=> {
    let res = await api.post("/user/verify",data);
    return res;
}

const verifyUser=async (data)=> {
    let res= await api.patch("/user/verifyuser",data);
    console.log(res.data);
}

const userLogin=async (data)=> {
    let res=await api.post("/user/login",data);
    return res;
}

const resetPassword=async (data)=> {

    let res= await api.patch("/user/resetpassword",data);
    return res;
}

const googleAuth= async ()=>{


}

export { registerApi,verifyEmail,verifyUser,userLogin,resetPassword,googleAuth }