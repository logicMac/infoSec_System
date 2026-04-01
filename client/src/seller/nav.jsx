import { Link, useNavigate } from "react-router-dom";
import navLogo from "../assets/navlogo.png";

export default function NavBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            navigate("/login");
    };

    return(
         <header className="bg-white shadow-sm border border-gray-200 p-5">
                    <div className="px-4 py-4 flex items-center justify-between">

                        {/* Logo */}
                        <div className="flex items-center h-12 w-62 -space-x-1">
                            <img src={navLogo} className="text-3xl font-semibold text-black object-contain ml-0"/>
                        </div>

                        {/*Nav*/}
                        <div className="flex flex-row space-x-10 text-black items-center">
                            <Link to='/seller/dashboard'>Dashboard</Link>
                            <Link to='/seller/products'>Products</Link>
                            <Link>Shop</Link>
                            <Link>Orders</Link>
                        </div>

                        <button 
                            className="bg-black rounded-md p-2 text-white w-40 hover:scale-105 transition duration-200"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
            </header>
    );
}