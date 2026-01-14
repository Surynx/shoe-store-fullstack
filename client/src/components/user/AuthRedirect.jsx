import { Navigate } from "react-router-dom";

export default function AuthRedirect({children}) {

    let user = localStorage.getItem("userToken") || null;

    if(user) {

        return <Navigate to={"/"}/>
    }else {

        return children;
    }
}