import { useState } from "react";
import CustomerNavbar from "./navbar";
import { useLocation } from "react-router-dom";
import { orderProducts } from "../api/orderApi";
import { getAuthData } from "../utils/authGetter";
import COD from "../assets/COD.png";

export default function ProductDetail() {
   const location = useLocation();
   const [quantity, setQuantity] = useState(1);
   const product = location.state?.product;
   const token = getAuthData();

   const handleBuyProduct = async (e) => {
      e.preventDefault(); // CRITICAL: Stop the page from refreshing
      try {
         // Fixed typo: product instead of poroduct
         const res = await orderProducts(token, product.product_id); 
         console.log("Success:", res);
      } catch (error) {
         console.log(error);
      }
   } 

   const increment = () => {
      setQuantity(quantity + 1);
   }

   const decrement = () => {
      setQuantity(quantity - 1);

      if (quantity <= 1) {
         setQuantity(1);
      }
   }

   if (!product) return <div className="p-10 text-center">No product data found.</div>;

   return (
      <div className="min-h-screen bg-gray-100">
         <CustomerNavbar />

         {/* Main Container: Added max-width so it doesn't look stretched on big screens */}
         <form 
            onSubmit={handleBuyProduct} 
            className="flex flex-col md:flex-row gap-10 p-6 md:p-12 max-w-7xl mx-auto"
         >
            {/* LEFT SIDE: Product Display */}
            <div className="flex flex-col  w-full md:w-3/5 space-y-8">

               <p>&#8592;</p>
               
               {/* Price Header - Explicitly Left Aligned */}
               <div className="space-y-1">
                  <p className="text-gray-500 font-medium uppercase text-xs tracking-widest">Amount to Pay</p>  
                  <p className="text-4xl font-bold text-gray-900">&#8369;{product.price}</p>
               </div>

               {/* Product Detail Card */}
               <div className="flex items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex flex-row justify-center items-center gap-4">
                     <div className="h-32 w-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img 
                           src={`http://localhost:3000/uploads/${product.image}`} 
                           alt={product.product_name} 
                           className="h-full w-full object-contain p-2"
                        />
                  </div>
                  <div className="flex flex-row">  
                     <div className="flex flex-col space-y-2">
                           <h2 className="text-xl font-semibold text-gray-800">{product.product_name}</h2>
                           <p className="text-gray-400 text-sm italic">{product.product_description}</p>
                           <div className="flex flex-row justify-start items-center gap-2"> 
                              <p>Size:</p> 
                              <select className="text-center p-1 border border-gray-300 rounded-md w-15">
                              <option value="S">S</option>
                              <option value="M">M</option>
                              <option value="L">L</option>
                              <option value="XL">XL</option>
                              <option value="XXL">XXL</option>
                           </select>
                           </div>
                     </div>
                  </div>
                  </div>
                  
                  <div className="flex flex-row bg-gray-200 rounded-md justify-center items-center space-x-4">
                     <button 
                        onClick={decrement}
                        className="p-1 border border-gray-100 rounded-md"
                        >
                           -
                     </button>
                     <p>{quantity}</p>
                     <button 
                        onClick={increment}
                        className="p-1 border border-gray-100 rounded-md"
                        >
                           +
                     </button>
                  </div>
               </div>      
            </div>   

            {/* RIGHT SIDE: Order Summary Card */}
            <div className="w-full md:w-2/5 bg-white p-8 rounded-3xl shadow-xl border border-gray-200 h-fit sticky top-10">
               <h1 className="text-2xl font-bold text-gray-800 mb-6">Order summary</h1>
               
               <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                     <span>Subtotal</span>
                     <span className="font-medium">&#8369;{product.price}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                     <span>Shipping</span>
                     <span className="text-green-600 font-medium">Calculated at next step</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                     <div className="space-y-4">
                        <h1 className="text-xl font-semibold">Payment method</h1>

                        <div className="flex flex-col space-y-4">
                           <div className="flex flex-row justify-between items-center">
                              <div className="flex flex-row">
                                 <img src={COD} alt="" className="w-10"/>
                              <p>Cash on delivery</p>
                              </div>
                              <input type="radio" />
                           </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                           <div className="flex flex-row justify-between items-center">
                              <p>Maya</p>
                              <input type="radio" />
                           </div>
                        </div>   
                     </div>      

                     <div className="flex justify-between items-end">
                        <span className="text-gray-800 font-bold text-lg">Total</span>
                        <span className="text-3xl font-black text-black">&#8369;{product.price}</span>
                     </div>
                  </div>

                  <button 
                     type="submit"
                     className="w-full bg-black hover:scale-105 transition duration-200 text-white font-bold py-4 rounded-xl mt-6 active:scale-95 shadow-lg shadow-blue-200"
                  >
                     Confirm Purchase
                  </button>
               </div>
            </div>
         </form>
      </div>   
   ); 
}