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
        <aside className="flex h-screen bg-gray-100 shadow-xl ">
            <div className="flex flex-row justify-between w-full p-5 h-20">
                <div>
                    <h1>ShopX</h1>
                </div>

                <div className="">
                    <input type="search" className="p-2 border rounded-md"/>
                </div>

                <div>
                    <button onClick={handleLogout} className="p-2 bg-black text-white rounded-md">Logout</button>
                </div>
            </div>  
        </aside>
    );
}