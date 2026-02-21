import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { LoginUserApi } from "../api/authApi";

export default function LoginPage() {
    //loginData state
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    //Error state
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await LoginUserApi(loginData);
            
            if (!res.ok) {
                setError(res.msg);
                return;
            }

            // After successful login, redirect to OTP page with user data
            navigate("/otp", {
                state: {
                    user_id: res.data.user.user_id,
                    username: res.data.user.username,
                    role: res.data.user.role,
                    otp: res.data.otp // For testing purposes
                }
            });

        } catch (error) {
            console.error("Error sending data to API", error);
        }
    }

    return (
        <div className="flex h-screen">
        {/* Left side: Image 70% */}
        <div className="w-[70%] h-full">
            <img
            src={Logo}
            alt="Login"
            className="w-full h-full object-cover"
            />
        </div>

        {/* Right side: Inputs 30% */}
        <div className="w-[30%] flex flex-col justify-center items-center p-10 bg-gray-50 space-y-8">
            <h1 className="text-3xl font-bold mb-2">LOGIN</h1>
            <p className="text-red-500">{error}</p>

            <form 
                className="flex flex-col w-full justify-center items-center "
                onSubmit={handleLogin}
            >
                <div className="flex flex-col justify-center items-center w-full">
                    <input      
                        type="text"
                        placeholder="Username"
                        className="mb-4 w-3/4 p-2 border border-gray-400 rounded-md"
                        onChange={(e) =>
                        setLoginData({ ...loginData, username: e.target.value })
                    }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="mb-4 w-3/4 p-2 border border-gray-400 rounded-md"
                        onChange={(e) =>
                            setLoginData({ ...loginData, password: e.target.value })
                        }
                    />
                </div>
                
                <div className="flex flex-col w-full justify-center items-center gap-y-4">
                    <button 
                        className="w-3/4 p-2 bg-black text-white rounded-md hover:scale-105 duration-200 transition"
                            type="submit"
                    >
                        Login
                    </button>

                    <p>
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </form>
        </div>
        </div>
    );
}
