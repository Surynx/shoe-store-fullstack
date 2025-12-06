import { data } from "react-router-dom";
import api from "./config/Api";

const registerApi=async (data) => {
    const res = await api.post("/user/register",data);
    return res;
    
}

const verifyEmail=async (data)=> {
    const res = await api.post("/user/verify",data);
    return res;
}

const verifyUser=async (data)=> {
    const res= await api.patch("/user/verifyuser",data);
    console.log(res.data);
}

const userLogin=async (data)=> {
    const res=await api.post("/user/login",data);
    return res;
}

const resetPassword=async (data)=> {

    const res= await api.patch("/user/resetpassword",data);
    return res;
}

const getAllCategoryForUser= async()=> {

    const res= await api.get("/user/category");
    return res;
}

const getAllBrandForUser= async()=> {

    const res= await api.get("/user/brand");
    return res;
}

const getAllLatestProducts= async()=>{

    const res=await api.get("/user/latest/product");
    return res;
}

const getShopProductList= async(filterValue)=> {

    const res= await api.post("/user/shop/product",filterValue);
    return res;
}

const getProductData= async(id)=> {

    const res= await api.get(`/user/product/${id}`);
    return res;
}

const getUserInfo= async()=> {

    const res= await api.get("/user/account/profile");
    return res;
}

const editUserInfo= async(data)=> {
    const res= await api.patch("/user/account/profile/edit",data);
    return res;
}

const sentOtpToPhone= async(data)=> {
    
    console.log(data);
    const res= await api.post("/user/account/phone/otp",data);
    return res;
}

const verifyPhone=async(data)=> {

    const res= await api.patch("/user/account/phone/verify",data);
    return res;
}

const sendOtpToEmail= async(data)=> {
    
    const res= await api.post("/user/account/email/otp",data);
    return res;
}

const verifyEmailOtp= async(data)=> {

    const res= await api.patch("/user/account/email/verify",data);
    return res;
}

const addNewAddress= async(data)=> {

    const res= await api.post("/user/address/add",data);
    return res;
}

const getAllAddress= async(data)=> {

    const res= await api.get("/user/address");
    return res;
}

const deleteAddress= async(id)=> {

    const res= await api.delete(`/user/address/${id}`);
    return res;
}

const updateAddress= async(data,id)=> {

    const res= await api.put(`/user/address/${id}`,data);
    return res;
}

const changePassword= async(data)=> {

   const res= await api.patch("/user/account/changepassword",data);
   return res; 
}

const addToCart= async(data)=> {

    const res= await api.post("/user/cart/add",data);
    return res;
}

const fetchCartInfo= async()=> {

    const res= await api.get("/user/cart");
    return res;
}

const removeProductFromCart= async(id)=> {

    const res= await api.patch(`/user/cart/remove/${id}`);
    return res;
}

const increaseQty= async(id)=> {

    const res= await api.patch(`/user/cart/increase/${id}`);
    return res;
}

const decreaseQty= async(id)=> {

    const res= await api.patch(`/user/cart/decrease/${id}`);
    return res;
}

const getCartCount= async()=> {

    const res= await api.get("/user/cart/count");
    return res;
}

const validateCartItems= async()=> {

    const res= await api.get("/user/cart/validate");
    return res;
}

const getCheckoutInfo= async()=> {

    const res= await api.get("/user/checkout");
    return res;
}

const placeNewOrder= async(data)=> {

    const res= await api.post("/user/order",data);
    return res;
}

const getOrderDetails= async(id)=> {

    const res= await api.get(`/user/order/${id}`);
    return res;
}

const getAllOrders= async()=> {

    const res= await api.get("/user/order");
    return res;
}

const cancelOrder= async({order_id})=> {
    
    const res= await api.patch(`/user/order/cancel/${order_id}`);
    return res;
}

const cancelSingleItem= async({order_id,item_id})=> {
    
    const res= await api.patch(`/user/order/item/cancel/${order_id}/${item_id}`);
    return res;
}


export { registerApi,verifyEmail,verifyUser,userLogin,resetPassword,getAllLatestProducts,getShopProductList,getAllCategoryForUser,
    getAllBrandForUser,getProductData,getUserInfo,editUserInfo,sentOtpToPhone,verifyPhone,sendOtpToEmail,verifyEmailOtp,addNewAddress,
    getAllAddress,deleteAddress,updateAddress,changePassword,addToCart,fetchCartInfo,removeProductFromCart,increaseQty,decreaseQty,getCartCount,
    getCheckoutInfo,placeNewOrder,validateCartItems,getOrderDetails ,getAllOrders,cancelOrder,cancelSingleItem }