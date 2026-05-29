import { useState, useEffect } from "react";
import { getAuthData } from "../utils/authGetter";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "./navbar";
import { getCustomerStats } from "../api/analyticsApi";
import { toast, Toaster } from "sonner";

export default function CustomerDashboard() {
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();
    const { token, id } = getAuthData() || {};
    const userId = Number(id);

    // Dynamic calculations derived safely from our formatted state
    const totalOrders = stats?.quantity || 0;
    const totalSpent = stats?.total_price || 0;

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return; 
        }

        const getStats = async () => {
            try {
                const res = await getCustomerStats(userId);

                // Check if response is successful and contains data
                if (res.ok && res.data) {
                    const orderList = res.data; // This is your (2) [{…}, {…}] array

                    // 1. Total Orders is simply the number of items in the array
                    const totalOrdersCount = orderList.length;

                    // 2. Calculate Total Spent by accumulating the price of each order
                    const totalSpentSum = orderList.reduce((sum, order) => {
                        // Change 'total_price' or 'price' depending on your exact backend column key
                        const orderPrice = Number(order.total_price) || 0; 
                        return sum + orderPrice;
                    }, 0);

                    // 3. Structure the object exactly how your UI expects it
                    setStats({
                        quantity: totalOrdersCount,
                        total_price: totalSpentSum,
                        cartItems: stats?.cartItems || 0 // Placeholder or managed separately
                    });
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch Stats");
            }
        };
        
        getStats();
    }, [token, userId]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-center" />
            <CustomerNavbar/>
            
            <div className="flex flex-row justify-center items-center p-10 gap-5">
                <div className="flex flex-col items-center justify-center w-80 bg-white rounded-md shadow-xl h-32">
                    <h1 className="text-gray-500 font-medium">Total Orders</h1>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
                </div>

                <div className="flex flex-col items-center justify-center w-80 bg-white rounded-md shadow-xl h-32">
                    <h1 className="text-gray-500 font-medium">Total Spent</h1>
                    {/* Formatted to 2 decimal places for clean currency display */}
                    <p className="text-3xl font-bold text-gray-900 mt-2">${totalSpent.toFixed(2)}</p>
                </div>

                <div className="flex flex-col items-center justify-center w-80 bg-white rounded-md shadow-xl h-32">
                    <h1 className="text-gray-500 font-medium">Cart</h1>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.cartItems || 0}</p>
                </div>  
            </div>

            {/* Grid Layout Placeholders */}
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