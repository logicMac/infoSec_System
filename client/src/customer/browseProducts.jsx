import { useState, useEffect } from "react";
import CustomerNavbar from "./navbar";
import { getAllProduct } from "../api/productApi";
import { useNavigate } from "react-router-dom";

export default function BrowseProducts () {
    const [products, setProducts] = useState([]);
    const [selectedId, setSelectedId] = useState();
    const [selectedProduct, setSelectedProduct] = useState({});
    const [order, setOrder] = useState();
    const [error, setError] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllProduct();

                if (res.ok) {
                    setProducts(res.data);
                } else {
                    console.log("Error fetching products");
                }
            } catch (error) {
                console.log(error);
                setError(error);
            }
        }
        
        fetchData();
    }, [])

    return(
        <div className="">
            <CustomerNavbar/>

            <div className="flex justify-start items-start p-10">
                <div className="w-full h-60 shadow-xl rounded-xl">
                    image
                </div>
            </div>

            <div className="flex flex-row items-start justify-center text-sm text-center gap-5 tracking-wide">
                <div className="p-2 bg-gray-200 text-black rounded-full w-30 hover:scale-110 transition duration-200">Apparel</div>
                <div className="p-2 bg-gray-200 text-black rounded-full w-30 hover:scale-110 transition duration-200">Electronics</div>
                <div className="p-2 bg-gray-200 text-black rounded-full w-30 hover:scale-110 transition duration-200">Fashion</div>
                <div className="p-2 bg-gray-200 text-black rounded-full w-30 hover:scale-110 transition duration-200">Toys</div>
                <div className="p-2 bg-gray-200 text-black rounded-full w-30 hover:scale-110 transition duration-200">Books</div>
            </div>
 
            <div className="flex flex-row justify-start items-center gap-5 p-10">
                {products.map((p) => (  
                    <div key={p.product_id} className="flex flex-col items-start justify-center p-5 shadow-xl rounded-md gap-y-3"> 
                        <img src={`http://localhost:3000/uploads/${p.image}`} alt="" className="w-100 h-100 border border-gray-100 rounded-md"/>

                        <h1 className="text-xl font-semibold tracking-wide">{p.product_name}</h1>
                        <p className="text-black tracking-wide">{p.product_description}</p>
                        <p className="text-xl font-semibold text-green-600">&#8369;{p.price}</p>

                        <div className="flex flex-row justify-center items-center gap-5 w-100">
                            <button className="p-2 text-blackc border rounded-md hover:scale-105 transition duration-200 w-full">Cart</button>
                            <button 
                                onClick={() => {
                                    navigate('/customer/productDetail', {
                                        state: {product: p}
                                    }); 
                                }}
                                className="p-2 text-white bg-black rounded-md hover:scale-105 transition duration-200 w-full">
                                    Buy
                            </button>
                        </div>
                    </div>
                ))}
            </div>  
        </div>
    );
} 