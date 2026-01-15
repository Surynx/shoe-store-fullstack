import axios from "axios";
import toast from "react-hot-toast";

const api=axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(

    (res)=>{
        if(res.url.startsWith("/admin")) {

            const token=localStorage.getItem("adminToken");
            res.headers.authorization = `Bearer ${token}`

        }else if (res.url.startsWith("/user/account") || res.url.startsWith("/user/address") || res.url.startsWith("/user/cart") 
                || res.url.startsWith("/user/checkout") || res.url.startsWith("/user/order") || res.url.startsWith("/user/wishlist") || 
                res.url.startsWith("/user/coupon") || res.url.startsWith("/user/wallet") || res.url.startsWith("/user/payment") || 
                res.url.startsWith("/user/navbar")) {

            const token= localStorage.getItem("userToken");
            res.headers.authorization= `Bearer ${token}`
        }

        return res;
    },
    (error)=>{
        return Promise.reject(error);
    }
)


api.interceptors.response.use((response) => {

    return response;

  },(error) => {

    const status = error.response?.status;
    const data = error.response?.data;

  
    if (status === 403 && data?.blocked) {

      localStorage.removeItem("userToken");
      
      toast.error("Your account has been blocked");

      window.location.href = "/login";
    }

    if (status === 401) {

      localStorage.removeItem("userToken");
      
      window.location.href = "/login";

    }

    return Promise.reject(error);
  }
);

export default api;