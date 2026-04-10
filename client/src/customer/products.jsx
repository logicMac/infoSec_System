import { useState, useEffect } from "react";
import CustomerNavbar from "./navbar";
import { getAllProduct } from "../api/productApi";

export default function BrowseProducts () {
    const [products, setProducts] = useState({});

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
    })

    return(
        <div className="">
            <CustomerNavbar/>
            <div className="flex flex-col justify-center items-center">
                <h1>Products</h1>

                {products.map((p) => {
                    <div key={p.product_id} className="flex flex-col p-5">
                        <img src="" alt="" />
                    </div>
                })}
            </div>  
        </div>
    );
} 