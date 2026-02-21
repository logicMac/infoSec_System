import LoginPage from "./auth/login"
import RegisterPage from "./auth/register"
import OtpPage from "./auth/otpPage"
import { Route, Router, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/otpPage" element={<OtpPage/>}/>
      </Routes>
    </>
  )
}

export default App
