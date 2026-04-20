import { useState } from "react";
import CustomerNavbar from "./navbar";
import { useLocation } from "react-router-dom";

export default function ProductDetail() {
   const location = useLocation();
   const product = location.state?.product;

   return(
      <div>
         <CustomerNavbar/>

         {product((p) => {
            <div key={p.product_id} className="flex flex-row justify-center items-center space-x-5">
               <div>
                  <img src={`http://localhost:3000/uploads/${p.image}`} alt="" />
               </div>

               <div className="flex fkex-col">

               </div>
            </div>
         })}
      </div>
   ); 
}