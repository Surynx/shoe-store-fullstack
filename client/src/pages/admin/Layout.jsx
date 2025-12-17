import Sidebar from '../../components/admin/Sidebar'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Toaster } from 'react-hot-toast'

function Layout() {

    return (
        <div className="flex">
            <ToastContainer/>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <Sidebar />
            <div className="ml-54 w-full min-h-screen bg-gray-100 p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout