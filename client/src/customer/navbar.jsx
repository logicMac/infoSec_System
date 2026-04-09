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
        <aside className="flex h-screen bg-gray-100 shadow-xl">
            <div className="flex flex-row justify-between w-full p-5 h-20 shadow-xl">
                <div>
                    <h1 className="text-2xl font-semibold">ShopX</h1>
                </div>

                <div className="">
                    <div className="flex items-center">
                        <i className="fas fa-search text-gray-400 text-center cursor-pointer mx-1 absolute"></i>
                        <input type="search" className="p-2 border border-gray-400 rounded-md relative"/>
                    </div>
                </div>

                <div>
                    <button onClick={handleLogout} className="p-2 bg-black text-white rounded-md">Logout</button>
                </div>
            </div>  
        </aside>
    );
}