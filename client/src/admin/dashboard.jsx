import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Applogo from "../assets/Applogo.png";
import { Link } from "react-router-dom";

export default function CustomerDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);


    useEffect(() => {
        // Get user data from localStorage
        const userData = sessionStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
                
            // Redirect if not a customer
            if (parsedUser.role !== "admin") {
                navigate("/Notfound404");
            }
        } else {
            // No user data, redirect to login
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
       
            <header className="bg-black shadow-sm border border-gray-200 p-5">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between space-x-4">

                    {/* Logo */}
                    <div className="flex items-center">
                        <p className="text-3xl font-semibold text-white">ShopX</p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="search"
                            placeholder="Search..."
                            className="p-2 pr-10 w-200 bg-white rounded-sm border"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black p-2 rounded-sm"></i>
                    </div>

                    {/* Profile */}
                   {/* Profile */}
                    <div className="relative">
                        <button className="bg-white p-3 rounded-full">
                            <i onClick={() => setOpen(true)} className="fa-solid fa-user"></i>
                        </button>

                       {open && (
                            <div className="flex flex-col text-center items-center absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
                               <div className="flex flex-col items-center">
                                 <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    Profile
                                </button>   

                                <button 
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-500"
                                >
                                    Logout
                                </button>

                                <button className="text-white bg-red-500 w-full" onClick={() => setOpen(false)}>x</button>
                               </div>
                            </div>
                        )}

                    </div>

                </div>
            </header>

            
        </div>
    );
}
    