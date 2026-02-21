    import { useState } from "react";
    import { Link } from "react-router-dom";
    import Login from "../assets/login.png";

    export default function RegisterPage() {
    const [registerData, setRegisterData] = useState({
        username: "",
        password: "",
        confirm_Password: "",
        phone_Number: "",
        role: "customer"
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
            <h1 className="text-3xl font-bold mb-6">REGISTER</h1>

            <div className="flex flex-col w-full justify-center items-center">
                <input      
                    type="text"
                    placeholder="Username"
                    className="mb-4 w-3/4 p-2 border border-gray-400 rounded-md"
                    onChange={(e) =>
                        setRegisterData({ ...registerData, username: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="mb-4 w-3/4 p-2 border border-gray-400 rounded-md"
                    onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="mb-4 w-3/4 p-2 border border-gray-400 rounded-md"
                    onChange={(e) =>
                        setRegisterData({ ...registerData, confirm_Password: e.target.value })
                    }
                />

                <input
                    type="text"
                    placeholder="Phone number"
                    className="mb-4 w-3/4 p-2 border border-gray-400 rounded-md"
                    onChange={(e) =>
                        setRegisterData({ ...registerData, phone_Number: e.target.value })
                    }
                />

                <select 
                    onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                    className="p-2 border w-80 rounded-md" 
                    name="role"
                >role
                    <option value="customer">customer</option>
                    <option value="staff">staff</option>
                    <option value="seller">seller</option>
                    <option value="admin">admin</option>
                </select>
            </div>

                <button className="w-3/4 p-2 bg-black text-white rounded-md hover:scale-105 duration-200 transition">
                Login
                </button>

                <p>
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
        </div>
        </div>
    );
}