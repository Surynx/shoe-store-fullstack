import { Navigate } from 'react-router-dom'

function AdminProtected({children}) {
  
    if(localStorage.getItem("adminToken")) {
        return children
    }else{
        return <Navigate to="/admin/login"/>
    }
}

export default AdminProtected;