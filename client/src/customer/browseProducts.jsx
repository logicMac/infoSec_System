import { useState, useEffect } from "react";
import CustomerNavbar from "./navbar";
import { getAllProduct } from "../api/productApi";

export default function BrowseProducts () {
    const [products, setProducts] = useState([]);

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
            }
        }
        
        fetchData();
    }, [])

    return(
        <div className="">
            <CustomerNavbar/>

            <div className="flex justify-start items-start p-10">
                    <h1 className="text-2xl font-semibold">Products</h1>
            </div>

            <div className="flex flex-col justify-center items-center">
                

                {products.map((p) => (
                    <div key={p.product_id} className="flex flex-col items-start justify-center p-5 shadow-2xl">
                        <img src="" alt="" />

                        <h1>{p.product_name}</h1>
                        <p>{p.product_descripton}</p>
                        
                        <div className="flex flex-row justify-center items-center space-x-3">
                            <button className="p-2 text-white rounded-e-md hover:scale-105 transition duration-200">Cart</button>
                            <button className="p-2 text-white rounded-e-md hover:scale-105 transition duration-200">Buy</button>
                        </div>
                    </div>
                ))}
            </div>  
        </div>
    );
} 