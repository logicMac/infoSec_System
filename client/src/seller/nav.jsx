import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Applogo from "../assets/Applogo.png";

export default function NavBar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            navigate("/login");
    };

    return(
         <header className="bg-white shadow-sm border border-gray-200 p-5">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between ">

                        {/* Logo */}
                        <div className="flex items-center h-12 w-32 -space-x-1">
                            <p className="text-3xl text-black font-semibold m-0 leading-none">ShopX</p>
                            <img src={Applogo} className="text-3xl font-semibold text-black object-contain ml-0"/>
                        </div>

                        {/*Nav*/}
                        <div className="flex flex-row space-x-5 text-black">
                            <Link>Dashboard</Link>
                            <Link to='/seller/products'>Products</Link>
                            <Link>Shop</Link>
                            <Link>Orders</Link>
                        </div>

                    
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
    );
}