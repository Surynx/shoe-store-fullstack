import api from "./config/Api";

export const verifyAdmin = async (data) => {

    const res = await api.post("/admin/verify", data);
    return res;
}

export const getAllusers = async (search, page) => {

    const res = await api.get("/admin/users", {
        params: {
            search: search,
            page: page
        }
    });
    return res;
}

export const blockUser = async (data) => {

    const res = await api.patch('/admin/block-user', data);
    return res;
}

export const addCategory = async (data) => {

    const res = await api.post('/admin/category/add', data);
    return res;
}

export const getAllCategory = async (search, page) => {

    const res = await api.get("/admin/category", {
        params: {
            search: search,
            page: page
        }
    });
    return res;
}

export const editCategory = async (id, data) => {

    const res = await api.patch("/admin/category/edit", { id, data });
    return res;
}

export const addBrand = async (data) => {

    const res = await api.post("/admin/brand/add", data);
    return res;
}

export const getAllbrand = async (search, page) => {

    const res = await api.get("/admin/brand", {
        params: {
            search: search,
            page: page
        }
    });
    return res;
}

export const editBrand = async (formData, id) => {

    const res = await api.patch(`/admin/brand/edit/${id}`, formData);
    return res;
}

export const addProduct = async (formData) => {

    let res = await api.post("/admin/product/add", formData);
    return res;
}

export const getAllProduct = async (search, page) => {

    const res = await api.get("/admin/product", {
        params: {
            search: search,
            page: page
        }
    });
    return res;
}

export const editProduct = async (formData, id) => {

    const res = await api.put(`/admin/product/edit/${id}`, formData);
    return res;
}

export const addVariant = async (data, id) => {

    const res = await api.post(`/admin/variant/add/${id}`, data);
    return res;
}

export const getAllVariant = async (id) => {

    const res = await api.get(`/admin/variant/${id}`);
    return res;
}

export const removeVariant = async (id) => {

    const res = await api.delete(`/admin/variant/remove/${id}`);
    return res;
}

export const updateVariant = async (data, id) => {

    const res = await api.patch(`/admin/variant/edit/${id}`, data);
    return res;
}

export const getAllOrders = async (search, page) => {

    const res = await api.get("/admin/orders", {
        params: {
            search: search,
            page: page
        }
    });
    return res;
}

export const getOrderDetailsForAdmin = async (id) => {

    const res = await api.get(`/admin/order/${id}`);
    return res;
}

export const changeOrderStatus = async (data, id) => {

    const res = await api.patch(`/admin/order/status/${id}`, data);
    return res;
}

export const approveReturn = async (orderId, itemId) => {

    const res = await api.patch(`/admin/item/return/approve/${orderId}/${itemId}`);
    return res;
}

export const completeReturn = async (orderId, itemId) => {

    const res = await api.patch(`/admin/item/return/complete/${orderId}/${itemId}`);
    return res;
}

export const rejectReturn = async (orderId, itemId) => {

    const res = await api.patch(`/admin/item/return/reject/${orderId}/${itemId}`);
    return res;
}

export const addOfferForCategory = async (data, id) => {

    const res = await api.post(`/admin/category/offer/${id}`, data);
    return res;
}

export const getAllOfferOfCategory = async (id) => {

    const res = await api.get(`/admin/category/offers/${id}`);
    return res;
}

export const deleteOffer = async (id) => {

    const res = await api.delete(`/admin/category/offer/${id}`);
    return res;
}

export const addOfferForProduct = async (data, id) => {

    const res = await api.post(`/admin/product/offer/${id}`, data);
    return res;
}

export const getAllOfferOfProduct = async (id) => {

    const res = await api.get(`/admin/product/offers/${id}`);
    return res;
}

export const addNewCoupon = async (data) => {

    const res = await api.post(`/admin/coupon`, data);
    return res;
}

export const getAllCoupon = async (search, page) => {

    const res = await api.get("/admin/coupon", {
        params: {
            search: search,
            page: page
        }
    });
    return res;
}


export const changeCouponStatus = async (id, data) => {

    const res = await api.patch(`/admin/coupon/${id}`, data);
    return res;
}

export const getSalesPageInfo = async () => {

    const res = await api.get("/admin/sales");
    return res;
}

export const getSalesOverview = async (range) => {

    const res = await api.get("/admin/sales-report", {
        params: { range }
    });
    return res
}

export const getCustomSalesOverview = async (customStartDate, customEndDate) => {

    const res = await api.get("/admin/sales-report-custom", {
        params: { start: customStartDate, end: customEndDate }
    });
    return res
}

export const downloadExcelReport = async (range, start = null, end = null) => {

    const res = await api.get("/admin/sales-report/excel", {
        params: { range, start, end },
        responseType: "blob"
    });
    return res;
}

export const downloadPdfReport = async (range, start = null, end = null) => {

    const res = await api.get("/admin/sales-report/pdf", {
        params: { range, start, end },
        responseType: "blob"
    });
    return res;
}

export const getDashboardInfo = async () => {

    const res = await api.get("/admin/dashboard");
    return res;
}

export const addNewBanner = async (data) => {
    
    const res = await api.post("/admin/banner",data);
    return res;
}

export const getAllBanners = async () => {
    
    const res = await api.get("/admin/banner");
    return res;
}

export const  deleteBanner = async (id) => {
    
    const res = await api.delete(`/admin/banner/${id}`);
    return res;
}
