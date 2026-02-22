import LoginPage from "./auth/login"
import RegisterPage from "./auth/register"
import OtpPage from "./auth/otpPage"
import CustomerDashboard from "./customer/Dashboard"
import { Route, Router, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/otpPage" element={<OtpPage/>}/>
          <Route path="/customer/dashboard" element={<CustomerDashboard/>}/>
      </Routes>
    </>
  )
}

export default App
