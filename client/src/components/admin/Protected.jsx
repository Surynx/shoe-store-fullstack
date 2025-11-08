import React from 'react'
import Login from '../../pages/admin/Login'
import { Navigate } from 'react-router-dom'

function Protected({children}) {
  
    if(localStorage.getItem("adminToken")) {
        return children
    }else{
        return <Navigate to="/admin/login"/>
    }
}

export default Protected