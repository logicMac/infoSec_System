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

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <CustomerNavbar
                user={user}
            />

            <div className="ml-62">
                
            </div>
        </div>
    );
}
    