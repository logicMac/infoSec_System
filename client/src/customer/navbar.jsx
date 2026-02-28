import { Link } from "react-router-dom";
import AppLogo from "../assets/AppLogo.png";
import { Navigate } from "react-router-dom";

export default function CustomerNavbar ({user}) {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Navigate("/login");
    };
    
    return(
        <aside className="flex w-60 h-screen bg-gray-100 shadow-xl mt-1 fixed">
            <div className="flex flex-col justify-between w-full ">

                    {/* Sidebar Links */}
                    <div className="flex flex-col space-y-2 text-gray-700 font-medium p-10">
                        {/* Logo */}
                        <div className="w-50">
                            <img 
                            src={AppLogo} 
                            alt="App Logo"
                            className="w-full object-contain"
                            />
                        </div>
                        
                        <div className="space-y-4">
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

                    </div>

                    {/* Logout Button */}
                    <div className="mt-5 flex flex-col space-y-5 border-t border-gray-300 p-8">
                        <p className="text-gray-500 text-center mt-2">Welcome {user.username}!</p>
                        <button onClick={handleLogout} className="flex items-center justify-center gap-2 p-2 bg-black text-white rounded-md w-full hover:bg-red-600 transition">
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Logout
                        </button>
                    </div>
                </div>  
        </aside>
    );
}