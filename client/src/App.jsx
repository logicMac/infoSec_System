import LoginPage from "./auth/login"
import RegisterPage from "./auth/register"
import { Route, Router, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </>
  )
}

export default App
