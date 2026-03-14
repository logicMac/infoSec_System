import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "./navbar";

export default function CustomerDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user data from localStorage
        const userData = sessionStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            
            // Redirect if not a customer
            if (parsedUser.role !== "customer") {
                navigate("/Notfound404");
            }
        } else {
            // No user data, redirect to login
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
                    <div>
                        <i className="fa-solid fa-user bg-white p-3 rounded-full">
                            <option onClick={handleLogout}></option>
                            <option value=""></option>
                            <option value=""></option>
                        </i>
                    </div>

                </div>
            </header>

            
        </div>
    );
}
    