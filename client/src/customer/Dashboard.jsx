import { useState, useEffect } from "react";
import { getAuthData } from "../utils/authGetter";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "./navbar";
import { getCustomerStats } from "../api/analyticsApi";
import { toast, Toaster } from "sonner";

export default function CustomerDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const auth = getAuthData(); 

    useEffect(() => {
        if (!auth.token) {
            navigate('/login')
            return;
        }

        const getStats = async () => {
            try {
                const res = await getCustomerStats(auth.token);

                if (res.ok) {
                    toast.success("Fetched Stats Successfully");
                }
                
            } catch (err) {
                console.log(err);
                toast.error("Failed to fetch Stats");
            }
        } 
        getStats();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <CustomerNavbar/>
            <div className="flex flex-row justify-center items-center p-10 gap-5">
                <div className="flex flex-col items-center justify-center w-100 rounded-md shadow-xl h-30">
                    <h1>Total Orders</h1>
                </div>

                <div className="flex flex-col items-center justify-center w-100 rounded-md shadow-xl h-30">
                    <h1>Total Spent</h1>
                </div>

                <div className="flex flex-col items-center justify-center w-100 rounded-md shadow-xl h-30">
                    <h1>Cart</h1>
                </div>  
            </div>

            <div className="flex flex-row justify-center items-start p-10 gap-5">       
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col items-center justify-center w-150 rounded-md shadow-xl h-30"></div>
                    <div className="flex flex-col items-center justify-center w-150 rounded-md shadow-xl h-115"></div>
                </div>
                <div className="flex flex-col items-center justify-center w-150 rounded-md shadow-xl h-150"></div>
            </div>
        </div>
    );
}
    