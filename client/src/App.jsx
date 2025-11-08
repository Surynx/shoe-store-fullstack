import { Route, Routes } from "react-router-dom"
import Login from "./pages/admin/Login"
import { useEffect } from "react"
import Layout from "./pages/admin/Layout"
import User from "./components/admin/User"
import Dashboard from "./components/admin/Dashboard"
import Protected from "./components/admin/Protected"
import UserLayout from "./pages/user/userLayout"
import Home from "./pages/user/Home"
import UserLogin from "./pages/user/UserLogin"
import Signup from "./pages/user/Signup"
import Verify from "./pages/user/Verify"
import ForgetPassword from "./pages/user/ForgetPassword"
import ResetPassword from "./pages/user/ResetPassword"

function App() {

  return (
    <>
      <main>
        <Routes>
          {/* Admin Route */}

            <Route path="/admin/login" element={<Login/>}></Route>

            <Route path="/admin" element={<Protected><Layout/></Protected>}>
              <Route index path="dashboard" element={<Dashboard/>}/>
              <Route path="users" element={<User/>}/>
            </Route>

          {/* User Route */}
          
          <Route path="/" element={<UserLayout/>}>
            <Route index element={<Home/>}/>
            <Route path="login" element={<UserLogin/>}/>
            <Route path="signup" element={<Signup/>}/>
            <Route path="verify" element={<Verify/>}/>
            <Route path="forgotpassword" element={<ForgetPassword/>}/>
            <Route path="resetpassword" element={<ResetPassword/>}/>
          </Route>

        </Routes> 
      </main>
    </>
  )
}

export default App
