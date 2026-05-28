import { useState, useEffect } from "react";
import { getAuthData } from "../utils/authGetter";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "./navbar";
import { getCustomerStats } from "../api/analyticsApi";
import { toast, Toaster } from "sonner";

export default function CustomerDashboard() {
    // 1. FIXED: Set initial state to null because your analytical stats come back as a single Object, not an Array list
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();
    const { token, id } = getAuthData() || {};
    
    // Convert id safely for parameters
    const userId = Number(id);

    // 2. FIXED: Added optional chaining (?.) so it safely says 0 while waiting for your API data to finish downloading
    const totalOrders = stats?.quantity || 0;
    const totalSpent = stats?.total_price || 0;

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return; 
        }

        const getStats = async () => {
            try {
                // Pass the clean numeric userId to your API
                const res = await getCustomerStats(userId);

                if (res.ok) {
                    setStats(res.data);
                    
                    // 3. FIXED: Moving console logs INSIDE this block so you can see what the server actually replied with!
                    console.log("Real Data from Server:", res.data);
                    console.log("Quantity Received:", res.data?.quantity);
                    
                    toast.success("Fetched Stats Successfully");
                }
            } catch (err) {
                console.log(err);
                toast.error("Failed to fetch Stats");
            }
        };
        getStats();
    }, [token, userId]); // Added dependencies to clean up React architecture hooks warnings

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-center" />
            <CustomerNavbar/>
            
            <div className="flex flex-row justify-center items-center p-10 gap-5">
                {/* 4. FIXED: Clean background padding layout values added so cards look beautiful */}
                <div className="flex flex-col items-center justify-center w-80 bg-white rounded-md shadow-xl h-32">
                    <h1 className="text-gray-500 font-medium">Total Orders</h1>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
                </div>

                <div className="flex flex-col items-center justify-center w-80 bg-white rounded-md shadow-xl h-32">
                    <h1 className="text-gray-500 font-medium">Total Spent</h1>
                    <p className="text-3xl font-bold text-gray-900 mt-2">${totalSpent}</p>
                </div>

                <div className="flex flex-col items-center justify-center w-80 bg-white rounded-md shadow-xl h-32">
                    <h1 className="text-gray-500 font-medium">Cart</h1>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.cartItems || 0}</p>
                </div>  
            </div>

            {/* Grid Layout Placeholders below... */}
            <div className="flex flex-row justify-center items-start p-10 gap-5">       
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col items-center justify-center w-150 bg-white rounded-md shadow-xl h-30"></div>
                    <div className="flex flex-col items-center justify-center w-150 bg-white rounded-md shadow-xl h-115"></div>
                </div>
                <div className="flex flex-col items-center justify-center w-150 bg-white rounded-md shadow-xl h-150"></div>
            </div>
        </div>
    );
}