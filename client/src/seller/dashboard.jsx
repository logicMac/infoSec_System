import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./nav";

export default function SellerDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

        useEffect(() => {
            // Get user data from localStorage
            const userData = sessionStorage.getItem("user");
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                    
                // Redirect if not a customer
                if (parsedUser.role !== "seller") {
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
            <div className="min-h-screen bg-gray-100">
                <NavBar/>
               
                <div className="flex flex-row justify-center space-x-5 m-10 h-40">
                    <div className="bg-white w-140 rounded-md">
                        <h1>Total Products</h1>
                        <p></p>
                        <div>
                            <i class="fa-solid fa-cube"></i>
                        </div>
                    </div>
                    <div className="bg-white w-140 rounded-md">
                        <h1>Total Orders</h1>
                    </div>
                    <div className="bg-white w-140 rounded-md">
                        <h1>Total Revenue</h1>

                        
                    </div>
                </div>

                <div className="flex justify-center flex-row space-x-5 m-5 h-130">
                    <div className="bg-white w-212">r</div>
                    <div className="bg-white w-212"></div>
                </div>
            </div>  
        );
    }
        