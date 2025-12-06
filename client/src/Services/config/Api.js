import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const api=axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
});

api.interceptors.request.use(

    (res)=>{
        if(res.url.startsWith("/admin")) {

            const token=localStorage.getItem("adminToken");
            res.headers.authorization = `Bearer ${token}`

        }else if(res.url.startsWith("/user/account") || res.url.startsWith("/user/address") || res.url.startsWith("/user/cart") 
        || res.url.startsWith("/user/checkout") || res.url.startsWith("/user/order")) {

            const token= localStorage.getItem("userToken");
            res.headers.authorization= `Bearer ${token}`
        }

        return res;
    },
    (error)=>{
        return Promise.reject(error);
    }
)


api.interceptors.response.use(
    (response)=>{

        if(response.data?.isBlock) {
            localStorage.removeItem("userToken");
        }
        return response;
        
    },
    (error)=>{

        return Promise.reject(error);
    }
)

export default api;