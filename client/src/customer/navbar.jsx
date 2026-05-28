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
        <nav className="w-full bg-gray-100 shadow-md">
            <div className="flex flex-row items-center w-full px-8 h-20 max-w-screen-2xl mx-auto">
                
                {/* Brand Logo - flex-1 so it takes equal space as logout side */}
                <div className="flex items-center flex-1">
                    <h1 className="text-2xl font-semibold text-gray-900">ShopX</h1>           
                </div>

                {/* Central Navigation Links - centered naturally */}
                <div className="flex items-center space-x-6 text-gray-700 font-medium">
                    <Link to='/customer/Dashboard' className="hover:text-black transition-colors">Home</Link>
                    <Link to='/customer/browseProducts' className="hover:text-black transition-colors">Browse</Link>
                    <Link to='/customer/cart' className="hover:text-black transition-colors">Cart</Link>
                    <Link to='/customer/orders' className="hover:text-black transition-colors">Orders</Link>
                    <Link to='/customer/notifications' className="hover:text-black transition-colors">Notifications</Link>
                </div>

                {/* Logout - flex-1 so it balances the logo side */}
                <div className="flex items-center justify-end flex-1">
                    <button 
                        onClick={handleLogout} 
                        className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-all shadow-sm"
                    >
                        Logout
                    </button>
                </div>

            </div>  
        </nav>
    );
}