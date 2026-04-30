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

            <form key={product.product_id} onSubmit={handleBuyProduct} className="flex flex-row justify-center items-start gap-5  bg-gray-100 h-screen">
               <div className="flex flex-col justify-center items-center bg-white w-1/2 p-10 rounded-lg shadow-lg h-full">
                  <div className="flex justify-center items-center border border-gray-100 rounded-md w-full h-150">
                     <img src={`http://localhost:3000/uploads/${product.image}`} alt="" className="h-100 w-full object-contain"/>
                  </div>      
               
                  <div className="flex flex-col justify-between items-start w-full mt-5">
                     <div className="p-2 space-y-5">   
                        <h1 className="text-2xl font-semibold">{product.product_name}</h1>  
                        <p className="text-md">{product.product_description}</p>   
                        <p className="text-2xl font-semibold text-green-600">&#8369;{product.price}</p>         
                     </div>
                  </div>   

                  <div className="flex flex-row justify-center items-center space-x-2 w-full mt-5">
                     <button type="submit" className="p-2 rounded-md w-full bg-black text-white hover:scale-105 transition duration-200">Buy now!</button>
                     <button type="button" className="p-2 rounded-md w-full bg-black text-white hover:scale-105 transition duration-200">Add to Cart</button>
                  </div>   
               </div>   

               <div className="flex justify-center items-center w-1/2 p-5 rounded-lg">
                  <div className="">
                     <h1 className="text-xl font-semibold">Order summary</h1>
                  </div>
               </div>
            </form>
      </div>   
   ); 
}