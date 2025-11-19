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

const getAllCategoryForUser= async()=> {

    let res= await api.get("/user/category");
    return res;
}

const getAllBrandForUser= async()=> {

    let res= await api.get("/user/brand");
    return res;
}

const getAllLatestProducts= async()=>{

    const res=await api.get("/user/latest/product");
    return res;
}

const getShopProductList= async(filterValue)=> {
    const res= await api.post("/user/shop/product",filterValue);
    console.log(res.data.data);
    return res;
}

export { registerApi,verifyEmail,verifyUser,userLogin,resetPassword,getAllLatestProducts,getShopProductList,getAllCategoryForUser,getAllBrandForUser }