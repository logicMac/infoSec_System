import { useState } from "react";
import CustomerNavbar from "./navbar";
import { useLocation } from "react-router-dom";
import { orderProducts } from "../api/orderApi";
import { getAuthData } from "../utils/authGetter";

export default function ProductDetail() {
   const location = useLocation();
   const product = location.state?.product;

   const token = getAuthData();

   const handleBuyProduct = async () => {
      try {
         const res = await orderProducts(token, poroduct.product_id, ) 
      } catch (error) {
         console.log(error);
      }
   } 

   return(
      <div>
         <CustomerNavbar/>

            <form key={product.product_id} onSubmit={handleBuyProduct} className="flex flex-row justify-center items-center p-50 bg-gray-100">
               <div className="bg-white w-100 p-5">
                  <div className="flex justify-center items-center border border-gray-100 rounded-md">
                     <img src={`http://localhost:3000/uploads/${product.image}`} alt="" className="h-100"/>
                  </div>      
               
                  <div className="flex flex-col justify-between items-start w-100 h-50 mt-5">
                     <div className="p-2 space-y-5">   
                        <h1 className="text-2xl font-semibold">{product.product_name}</h1>  
                        <p className="text-md">{product.product_description}</p>   
                        <p className="text-2xl font-semibold">{product.price}</p>         
                     </div>
                  </div>   

                  <div className="flex flex-row justify-center items-center space-x-2 w-full">
                     <button className="p-2 rounded-md w-full bg-black text-white hover:scale-105 transition duration-200">Buy now!</button>
                     <button className="p-2 rounded-md w-full  bg-black text-white hover:scale-105 transition duration-200">Add to Cart</button>
                  </div>   
               </div>   

               <div className="flex justify-center items-center bg-white w-100 h-200">
                  <div className="">
                     <h1>Order summary</h1>
                  </div>
               </div>
            </form>
      </div>   
   ); 
}