import { CheckCircle } from 'lucide-react'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

function AuthSuccess() {

    const {id} = useParams();
    const nav= useNavigate();

    useEffect(()=>{

        localStorage.setItem("userToken",id);

        nav("/",{replace:true});

        toast("Welcome to comet website!");

    },[]);


    return (
       <h1 className='m-10'>Redirecting.....</h1>
    )
}

export default AuthSuccess