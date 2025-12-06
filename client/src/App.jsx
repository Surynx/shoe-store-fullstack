import { Route, Routes } from "react-router-dom"
import Login from "./pages/admin/Login"
import Layout from "./pages/admin/Layout"
import UserManagment from "./pages/admin/UserManagment"
import Dashboard from "./components/admin/Dashboard"
import AdminProtected from "./components/admin/adminProtected"
import UserLayout from "./pages/user/userLayout"
import Home from "./pages/user/Home"
import UserLogin from "./pages/user/UserLogin"
import Signup from "./pages/user/Signup"
import Verify from "./pages/user/Verify"
import ForgetPassword from "./pages/user/ForgetPassword"
import ResetPassword from "./pages/user/ResetPassword"
import Cart from "./pages/user/Cart"
import UserProtected from "./components/user/UserProtected"
import Profile from "./pages/user/Profile"
import UserInfo from "./components/user/UserInfo"
import AuthSuccess from "./pages/user/AuthSuccess"
import CategoryManagment from "./pages/admin/CategoryManagment"
import AddCategory from "./pages/admin/AddCategory"
import BrandManagment from "./pages/admin/BrandManagment"
import AddBrand from "./pages/admin/AddBrand"
import ProductManagment from "./pages/admin/ProductManagment"
import AddProduct from "./pages/admin/AddProduct"
import AddVariant from "./pages/admin/Variants"
import Shop from "./pages/user/Shop"
import Product from "./pages/user/Product"
import EditProfile from "./pages/user/EditProfile"
import Address from "./pages/user/Address"
import AddressForm from "./components/user/AddressForm"
import CheckoutPage from "./pages/user/Checkout"
import OrderSuccess from "./pages/user/OrderSuccess"
import OrderListing from "./pages/user/OrderListing"
import OrderDetail from "./pages/user/OrderDetail"


function App() {

  return (
    <>
      <main>
        <Routes>
          {/* Admin Route */}

            <Route path="/admin/login" element={<Login/>}></Route>
            <Route path="/admin" element={<AdminProtected><Layout/></AdminProtected>}>
              <Route path="dashboard" element={<Dashboard/>}/>
              <Route path="users" element={<UserManagment/>}/>
              <Route path="category" element={<CategoryManagment/>}/>
              <Route path="category/add" element={<AddCategory/>}/>
              <Route path="category/edit/:id" element={<AddCategory/>}/>
              <Route path="brand" element={<BrandManagment/>}/>
              <Route path="brand/add" element={<AddBrand/>}/>
              <Route path="brand/edit/:id" element={<AddBrand/>}/>
              <Route path="product" element={<ProductManagment/>}/>
              <Route path="product/add" element={<AddProduct/>}/>
              <Route path="product/add/:id" element={<AddProduct/>}/>
              <Route path="product/varient/:id" element={<AddVariant/>}/>
            </Route>

          {/* User Route */}
          
          <Route path="/" element={<UserLayout/>}>
            <Route index element={<Home/>}/>
            <Route path="login" element={<UserLogin/>}/>
            <Route path="signup" element={<Signup/>}/>
            <Route path="verify" element={<Verify/>}/>
            <Route path="forgotpassword" element={<ForgetPassword/>}/>
            <Route path="resetpassword" element={<ResetPassword/>}/>
            <Route path="shop" element={<Shop/>}/>
            <Route path="shop/product/:id" element={<Product/>}/>
            <Route path="product/:id" element={<Product/>}/>
            <Route path="Cart" element={<UserProtected><Cart/></UserProtected>}/>
            <Route path="checkout" element={<CheckoutPage/>}/>
            <Route path="order/success/:id" element={<OrderSuccess/>}/>
            <Route path="/account" element={<UserProtected><Profile/></UserProtected>}>
              <Route index path="profile" element={<UserInfo/>}/>
              <Route path="edit" element={<EditProfile/>}/>
              <Route path="address" element={<Address/>}/>
              <Route path="address/add" element={<AddressForm/>}/>
              <Route path="address/:id" element={<AddressForm/>}/>
              <Route path="orders" element={<OrderListing/>}/>
              <Route path="order/detail/:id" element={<OrderDetail/>}/>
            </Route>
          </Route>
          <Route path="auth/google/success/:id" element={<AuthSuccess/>}/>
        </Routes> 
      </main>
    </>
  )
}

export default App
