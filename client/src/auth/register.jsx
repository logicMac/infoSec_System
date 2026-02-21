import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { RegisterApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    //states    
    const [registerData, setRegisterData] = useState({
        username: "",
        password: "",
        confirm_Password: "",
        phone_Number: "",
        role: "customer"
    });

    //error state
    const[error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (const key in registerData) {
            formData.append(key, (registerData)[key]);
        }

        try {
            const res = await RegisterApi();

            if (!res.ok) {
                setError(res.msg);
                return;
            } 

            navigate('/login');
        } catch (error) {
            console.log(error);
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
            <h1 className="text-3xl font-bold mb-2">REGISTER</h1>
            <p className="text-red-500">{error}</p>

            <form 
                className="flex flex-col w-full justify-center items-center"
                onSubmit={handleRegister}
            >
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
                    className="p-2 border border-gray-400 w-80 rounded-md" 
                    name="role"
                >role
                    <option value="customer">customer</option>
                    <option value="staff">staff</option>
                    <option value="seller">seller</option>
                    <option value="admin">admin</option>
                </select>

                <div className="flex flex-col justify-center items-center mt-10 w-full gap-y-4">
                    <button 
                        className="w-3/4 p-2 bg-black text-white rounded-md hover:scale-105 duration-200 transition"
                        type="submit"
                    >
                        Register
                    </button>

                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </form>
        </div>
        </div>
    );
}