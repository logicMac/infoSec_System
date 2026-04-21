import { useState } from "react";
import CustomerNavbar from "./navbar";
import { useLocation } from "react-router-dom";

export default function ProductDetail() {
   const location = useLocation();
   const product = location.state?.product;

   if (!product) {
      return (
         <div>
            <CustomerNavbar/>
            <div className="flex justify-center items-center h-screen">
               <p className="text-xl">Product not found</p>
            </div>
         </div>
      );
   }

   return(
      <div className="min-h-screen bg-gray-50">
         <CustomerNavbar/>

         <div className="max-w-7xl mx-auto p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {/* Product Image */}
               <div className="flex justify-center items-center bg-white p-8 rounded-lg shadow-lg">
                  <img 
                     src={`http://localhost:3000/uploads/${product.image}`} 
                     alt={product.product_name}
                     className="w-full h-auto max-h-96 object-contain rounded-md"
                  />
               </div>

               {/* Product Details */}
               <div className="flex flex-col justify-between bg-white p-8 rounded-lg shadow-lg">
                  <div className="space-y-6">
                     <h1 className="text-3xl font-bold text-gray-800">{product.product_name}</h1>
                     <p className="text-lg text-gray-600">{product.product_description}</p>
                     
                     <div className="border-t pt-4">
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-3xl font-bold text-green-600">&#8369;{product.price}</p>
                     </div>

                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                           <p className="text-gray-500">Stock</p>
                           <p className="font-semibold">{product.stock} available</p>
                        </div>
                        <div>
                           <p className="text-gray-500">Brand</p>
                           <p className="font-semibold">{product.brand}</p>
                        </div>
                        <div>
                           <p className="text-gray-500">Category</p>
                           <p className="font-semibold">{product.category_name}</p>
                        </div>
                        <div>
                           <p className="text-gray-500">Size</p>
                           <p className="font-semibold">{product.size}</p>
                        </div>
                     </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 mt-8">
                     <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-200 font-semibold">
                        Buy Now
                     </button>
                     <button className="w-full py-3 bg-white text-black border-2 border-black rounded-lg hover:bg-gray-100 transition duration-200 font-semibold">
                        Add to Cart
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>   
   ); 
}