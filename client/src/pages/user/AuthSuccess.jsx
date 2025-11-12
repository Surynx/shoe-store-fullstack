import { CheckCircle } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function AuthSuccess() {

    const {id} = useParams();
    const nav= useNavigate();

    useEffect(()=>{

        localStorage.setItem("userToken",id);
        nav("/",{replace:true});

    },[]);


    return (
       <h1 className='m-10'>Redirecting.....</h1>
    )
}

export default AuthSuccess