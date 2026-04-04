import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProduct } from "../api/productApi";
import NavBar from "./nav";

export default function SellerDashboard() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState({});
    const [totalProducts, setTotalProducts] = useState();
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

            const loadProducts = async () => {
                try {
                    const res = await getAllProduct();
                    const total = res.data.length;
                    setTotalProducts(total);

                    if (!res.ok) {
                        setError(res.msg);
                    }   
                    
                } catch (error) {
                    setError(error);
                }
            }

            loadProducts();

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
                    <div className="flex flex-col justify-center items-center bg-white w-140 rounded-md">
                        <h1 className="text-2xl font-semibold">Total Products</h1>
                         
                        <div className="flex items-center justify-between">
                            <i className="fa-solid fa-cube text-3xl"></i>
                            <p className="text-xl ml-3 font-semibold">{totalProducts}</p> 
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
        