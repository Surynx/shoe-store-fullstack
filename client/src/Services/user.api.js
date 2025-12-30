import api from "./config/Api";

export const registerApi=async (data) => {

    const res = await api.post("/user/register",data);
    return res;
    
}

export const verifyEmail=async (data)=> {

    const res = await api.post("/user/verify",data);
    return res;
}

export const verifyUser=async (data)=> {

    const res= await api.patch("/user/verifyuser",data);
    console.log(res.data);
}

export const userLogin=async (data)=> {
    
    const res=await api.post("/user/login",data);
    return res;
}

export const resetPassword=async (data)=> {

    const res= await api.patch("/user/resetpassword",data);
    return res;
}

export const getAllCategoryForUser= async()=> {

    const res= await api.get("/user/category");
    return res;
}

export const getAllBrandForUser= async()=> {

    const res= await api.get("/user/brand");
    return res;
}

export const getAllLatestProducts= async()=>{

    const res=await api.get("/user/latest/product");
    return res;
}

export const getShopProductList= async(filterValue)=> {

    const res= await api.post("/user/shop/product",filterValue);
    return res;
}

export const getProductData= async(id)=> {

    const res= await api.get(`/user/product/${id}`);
    return res;
}

export const getUserInfo= async()=> {

    const res= await api.get("/user/account/profile");
    return res;
}

export const editUserInfo= async(data)=> {
    const res= await api.patch("/user/account/profile/edit",data);
    return res;
}

export const sentOtpToPhone= async(data)=> {
    
    console.log(data);
    const res= await api.post("/user/account/phone/otp",data);
    return res;
}

export const verifyPhone=async(data)=> {

    const res= await api.patch("/user/account/phone/verify",data);
    return res;
}

export const sendOtpToEmail= async(data)=> {
    
    const res= await api.post("/user/account/email/otp",data);
    return res;
}

export const verifyEmailOtp= async(data)=> {

    const res= await api.patch("/user/account/email/verify",data);
    return res;
}

export const addNewAddress= async(data)=> {

    const res= await api.post("/user/address/add",data);
    return res;
}

export const getAllAddress= async(data)=> {

    const res= await api.get("/user/address");
    return res;
}

export const deleteAddress= async(id)=> {

    const res= await api.delete(`/user/address/${id}`);
    return res;
}

export const updateAddress= async(data,id)=> {

    const res= await api.put(`/user/address/${id}`,data);
    return res;
}

export const changePassword= async(data)=> {

   const res= await api.patch("/user/account/changepassword",data);
   return res; 
}

export const addToCart= async(data)=> {

    const res= await api.post("/user/cart/add",data);
    return res;
}

export const fetchCartInfo= async()=> {

    const res= await api.get("/user/cart");
    return res;
}

export const removeProductFromCart= async(id)=> {

    const res= await api.patch(`/user/cart/remove/${id}`);
    return res;
}

export const increaseQty= async(id)=> {

    const res= await api.patch(`/user/cart/increase/${id}`);
    return res;
}

export const decreaseQty= async(id)=> {

    const res= await api.patch(`/user/cart/decrease/${id}`);
    return res;
}

export const getCartCount= async()=> {

    const res= await api.get("/user/cart/count");
    return res;
}

export const validateCartItems= async()=> {

    const res= await api.get("/user/cart/validate");
    return res;
}

export const getCheckoutInfo= async()=> {

    const res= await api.get("/user/checkout");
    return res;
}

export const placeNewOrder= async(data)=> {

    const res= await api.post("/user/order",data);
    return res;
}

export const getOrderDetails= async(id)=> {

    const res= await api.get(`/user/order/${id}`);
    return res;
}

export const getAllOrders= async()=> {

    const res= await api.get("/user/order");
    return res;
}

export const cancelOrder= async({order_id})=> {
    
    const res= await api.patch(`/user/order/cancel/${order_id}`);
    return res;
}

export const cancelSingleItem= async({order_id,item_id})=> {
    
    const res= await api.patch(`/user/order/item/cancel/${order_id}/${item_id}`);
    return res;
}

export const handleReturnItem= async({order_id,item_id},reason)=> {

    const res= await api.patch(`/user/order/item/return/${order_id}/${item_id}`,reason);
    return res;
}

export const addToFavourite= async(data)=> {

    const res= await api.post("/user/wishlist/add",data);
    return res;
}

export const fetchWishListInfo= async () => {
    
    const res= await api.get("/user/wishlist");
    return res;
}

export const removeItemFromWishlist= async(id) => {

    const res= await api.patch(`/user/wishlist/item/${id}`);
    return res;
}

export const validateCoupon= async (data) => {

    const res= await api.post("/user/coupon",data);
    return res;
}

export const createRazorpayOrder= async (data) => {
    
    const res= await api.post("/user/wallet/create-order",data);
    return res;
}

export const verifyPayment= async (response) => {

    const res= await api.post("/user/wallet/addmoney",response);
    return res;
}

export const getWalletInfo= async () => {
    
    const res= await api.get("/user/wallet");
    return res;
}

export const createCheckoutOrder= async (data) => {
    
    const res= await api.post("/user/payment/create-order",data);
    return res;
}

export const verifyCheckoutPayment= async (data) => {
    
    const res= await api.post("/user/payment/verify",data);
    return res;
}

export const markPaymentFailed = async (data) => {
    
    const res= await api.post("/user/payment/failed",data);
    return res;
}

export const createPaymentRetryOrder = async (id) => {
    
    const res= await api.post(`/user/payment/retry/${id}`);
    return res;
}

 