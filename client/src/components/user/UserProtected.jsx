import React from 'react'
import { Navigate } from 'react-router-dom'

function UserProtected({children}) {
  
    if(localStorage.getItem("userToken")) {
        return children
    }else {
        return <Navigate to="/login"/>
    }
}

export default UserProtected