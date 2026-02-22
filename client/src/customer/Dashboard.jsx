import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            
            // Redirect if not a customer
            if (parsedUser.role !== "customer") {
                if (parsedUser.role === "admin") {
                    navigate("/admin");
                } else if (parsedUser.role === "staff") {
                    navigate("/staff");
                } else if (parsedUser.role === "seller") {
                    navigate("/seller");
                }
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
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user.username}!</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">My Orders</h3>
                        <p className="text-gray-600 mb-4">View and track your orders</p>
                        <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            View Orders
                        </button>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Browse Products</h3>
                        <p className="text-gray-600 mb-4">Explore our product catalog</p>
                        <button className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                            Shop Now
                        </button>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">My Profile</h3>
                        <p className="text-gray-600 mb-4">Manage your account settings</p>
                        <button className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Account Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Username:</p>
                            <p className="font-medium">{user.username}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Role:</p>
                            <p className="font-medium capitalize">{user.role}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">User ID:</p>
                            <p className="font-medium">{user.user_id}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
