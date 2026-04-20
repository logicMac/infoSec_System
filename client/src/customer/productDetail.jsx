import { useState } from "react";
import CustomerNavbar from "./navbar";
import { useLocation } from "react-router-dom";

export default function ProductDetail() {
   const location = useLocation();
   const product = location.state?.product;

   return(
      <div>
         <CustomerNavbar/>

            <div key={product.product_id} className="flex flex-row justify-center items-center space-x-5 p-50">
               <div className="flex justify-center items-center w-120 shadow-2xl rounded-md">
                  <img src={`http://localhost:3000/uploads/${product.image}`} alt="" className="h-100"/>
               </div>   
               
               <div className="flex flex-col">
                  <h1>{product.name}</h1>
                  <p>{product.product_description}</p>   
                  <p>{product.price}</p>
               </div>   
            </div>
      </div>   
   ); 
}