import { Link } from "react-router-dom";
import AppLogo from "../assets/AppLogo.png";
import { useNavigate } from "react-router-dom";

export default function CustomerNavbar ({user}) {
    const navigate = useNavigate();
    const handleLogout = () => {    
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    
    return(
        <aside className="flex bg-gray-100 shadow-xl">
            <div className="flex flex-row justify-between items-center w-full p-5 h-20 shadow-xl space-x-10">
                <div>
                    <h1 className="text-2xl font-semibold">ShopX</h1>           
                </div>

                <div className="space-x-5">
                    <Link to='/customer/Dashboard' className="hover:opacity-50">Home</Link>
                    <Link to='/customer/browseProducts'>Browse</Link>
                    <Link>Cart</Link>
                    <Link>Orders</Link>
                    <Link>Notifications</Link>
                </div>

                <div>
                    <button onClick={handleLogout} className="p-2 bg-black text-white rounded-md w-30">Logout</button>
                </div>
            </div>  
        </aside>
    );
}