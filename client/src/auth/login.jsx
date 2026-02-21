    import { useState } from "react";
    import { Link } from "react-router-dom";
    import Login from "../assets/login.png";

    export default function LoginPage() {
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    return (
        <div className="flex h-screen">
        {/* Left side: Image 70% */}
        <div className="w-[70%] h-full">
            <img
            src={Login}
            alt="Login"
            className="w-full h-full object-cover"
            />
        </div>

        {/* Right side: Inputs 30% */}
        <div className="w-[30%] flex flex-col justify-center items-center p-10 bg-gray-50 gap-y-8">
            <h1 className="text-3xl font-bold mb-6">LOGIN</h1>

            <div className="flex flex-col w-full justify-center items-center">
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

                <button className="w-3/4 p-2 bg-black text-white rounded-md hover:scale-105 duration-200 transition">
                Login
                </button>

                <p>
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>
        </div>
        </div>
    );
    }