import React from 'react'
import Sidebar from '../../components/admin/Sidebar'
import { Outlet } from 'react-router-dom'

function Layout() {

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 w-full min-h-screen bg-gray-100 p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout