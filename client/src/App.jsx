import LoginPage from "./auth/login"
import RegisterPage from "./auth/register"
import OtpPage from "./auth/otpPage"
import CustomerDashboard from "./customer/Dashboard"
import AdminDashboard from "./admin/dashboard"
import NotFound404 from "./pages/Notfound404"
import { Route, Router, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/otpPage" element={<OtpPage/>}/>
          <Route path="admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="customer/dashboard" element={<CustomerDashboard/>}/>
          <Route path="*" element={<NotFound404/>}/>
      </Routes>
    </>
  ) 
}

export default App
