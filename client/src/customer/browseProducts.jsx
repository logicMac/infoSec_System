import { useState, useEffect } from "react";
import CustomerNavbar from "./navbar";
import { getAllProduct } from "../api/productApi";


export default function BrowseProducts () {
    const [products, setProducts] = useState([]);
    const [selectedId, setSelectedId] = useState();
    const [order, setOrder] = useState();

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
 
            <div className="flex flex-row justify-start items-center gap-5 p-10">
                {products.map((p) => (  
                    <div key={p.product_id} className="flex flex-col items-start justify-center p-5 shadow-xl rounded-md gap-y-3"> 
                        <img src="" alt="" />

                        <h1>{p.product_name}</h1>
                        <p>{p.product_descripton}</p>
                        
                        <div className="flex flex-row justify-center items-center gap-5 w-100">
                            <button className="p-2 text-blackc border rounded-md hover:scale-105 transition duration-200 w-full">Cart</button>
                            <button className="p-2 text-white bg-black rounded-md hover:scale-105 transition duration-200 w-full">Buy</button>
                        </div>
                    </div>
                ))}
            </div>  
        </div>
    );
} 