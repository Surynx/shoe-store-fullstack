import { data } from "react-router-dom";
import api from "./config/Api";


const verifyAdmin=async(data)=>{
    const res = await api.post("/admin/verify",data);
    return res;
}

const getAllusers= async (search,page)=>{
    const res=await api.get("/admin/users",{
        params:{
            search:search,
            page:page
        }
    });
    return res;
}

const blockUser= async(data)=> {
    const res= await api.patch('/admin/block-user',data);
    return res;
}

const addCategory= async(data)=> {
    const res= await api.post('/admin/category/add',data);
    return res;
}

const getAllCategory= async(search,page)=> {
    const res= await api.get("/admin/category",{
        params:{
            search:search,
            page:page
        }
    });
    return res;
}

const editCategory= async(id,data)=> {
    const res= await api.patch("/admin/category/edit",{id,data});
    return res;
}

const addBrand= async(data)=> {
    const res= await api.post("/admin/brand/add",data);
    return res;
}

const getAllbrand= async(search,page)=> {
    const res= await api.get("/admin/brand",{
        params:{
            search:search,
            page:page
        }
    });
    return res;
}

const editBrand= async(formData,id)=> {

    const res=await api.patch(`/admin/brand/edit/${id}`,formData);
    return res;
}

const addProduct= async(formData)=> {
    let res=await api.post("/admin/product/add",formData);
    return res;
}

const getAllProduct= async(search,page)=> {
    const res= await api.get("/admin/product",{
        params:{
            search:search,
            page:page
        }
    });
    return res;
}

const editProduct= async(formData,id)=> {

    const res= await api.put(`/admin/product/edit/${id}`,formData);
    return res;
}

const addVariant= async(data,id)=> {
    const res= await api.post(`/admin/variant/add/${id}`,data);
    return res;
}

const getAllVariant= async(id)=> {
    const res= await api.get(`/admin/variant/${id}`);
    return res;
}

const removeVariant= async(id)=> {
    const res= await api.delete(`/admin/variant/remove/${id}`);
    return res;
}

const updateVariant= async(data,id)=> {
    const res= await api.patch(`/admin/variant/edit/${id}`,data);
    return res;
}

const getAllOrders= async(search,page)=> {

    const res= await api.get("/admin/orders",{
        params:{
            search:search,
            page:page
        }
    });
    return res;
}

const getOrderDetailsForAdmin= async(id)=> {

    const res= await api.get(`/admin/order/${id}`);
    return res;
}

const changeOrderStatus= async(data,id)=> {

    const res= await api.patch(`/admin/order/status/${id}`,data);
    return res;
}

const approveReturn= async(orderId, itemId)=> {

    const res= await api.patch(`/admin/item/return/approve/${orderId}/${itemId}`);
    return res;
}

const completeReturn= async(orderId, itemId)=> {

    const res= await api.patch(`/admin/item/return/complete/${orderId}/${itemId}`);
    return res;
}

const rejectReturn= async(orderId, itemId)=> {

    const res= await api.patch(`/admin/item/return/reject/${orderId}/${itemId}`);
    return res;
}

export { verifyAdmin,getAllusers,blockUser,addCategory,getAllCategory,editCategory,addBrand,getAllbrand,editBrand,addProduct,
    getAllProduct,editProduct,addVariant,getAllVariant,removeVariant,updateVariant,getAllOrders,getOrderDetailsForAdmin,changeOrderStatus,
    approveReturn,completeReturn,rejectReturn }