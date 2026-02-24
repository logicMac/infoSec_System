import { Link } from "react-router-dom";
import AppLogo from "../assets/AppLogo.png";

export default function CustomerNavbar () {
    
    return(
        <aside className="flex w-50 h-screen bg-gray-100 shadow-xl mt-1 fixed">
            <div className="flex flex-col justify-between w-full p-8">

                {/* Top Section */}
                <div className="flex flex-col space-y-10">

                    {/* Logo */}
                    <div className="w-40">
                        <img 
                          src={AppLogo} 
                          alt="App Logo"
                          className="w-full object-contain"
                        />
                    </div>

                    {/* Sidebar Links */}
                    <div className="flex flex-col gap-y-15 text-gray-700 font-medium">
                        
                        <Link className="flex items-center gap-3 hover:text-blue-600 transition">
                            <i className="fa-solid fa-compass"></i>
                            Browse
                        </Link>

                        <Link className="flex items-center gap-3 hover:text-blue-600 transition">
                            <i className="fa-solid fa-cart-shopping"></i>
                            Cart
                        </Link>

                        <Link className="flex items-center gap-3 hover:text-blue-600 transition">
                            <i className="fa-solid fa-box"></i>
                            Orders
                        </Link>

                        <Link className="flex items-center gap-3 hover:text-blue-600 transition">
                            <i className="fa-solid fa-user"></i>
                            Profile
                        </Link>

                        <Link className="flex items-center gap-3 hover:text-blue-600 transition">
                            <i className="fa-solid fa-bell"></i>
                            Notifications
                        </Link>

                    </div>

                        {/* Logout Button */}
                    <div className="mt-20">
                        <button className="flex items-center justify-center gap-2 p-2 bg-red-500 text-white rounded-md w-full hover:bg-red-600 transition">
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Logout
                        </button>
                    </div>
                </div>  
            </div>
        </aside>
    );
}