import { useState } from "react";
import CustomerNavbar from "./navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { orderProducts } from "../api/orderApi";
import { getAuthData } from "../utils/authGetter";
import COD from "../assets/COD.png";
import Maya from "../assets/Maya.png";

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [orderDetails, setOrderDetails] = useState({ payment_method: 'COD', size: 'M' });
  
  const product = location.state?.product;
  const token = getAuthData();

  const totalPrice = quantity * product.price;
  
  const handleBuyProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await orderProducts(token, {
        product_id: product.product_id,
        quantity, totalPrice,
        ...orderDetails
      });
      console.log("Success:", res);
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) return <div className="p-10 text-center">No product data found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <CustomerNavbar />

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-black mb-6 transition-colors"
        >
          <span className="mr-2">←</span> Back to Shop
        </button>

        {/* The Unified Card */}
        <form 
          onSubmit={handleBuyProduct}
          className=" bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col md:flex-row"
        >
          
          {/* LEFT SIDE: Product Info */}
          <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Product Image */}
              <div className="w-full sm:w-48 h-48 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100">
                <img 
                  src={`http://localhost:3000/uploads/${product.image}`} 
                  alt={product.product_name} 
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">New Arrival</span>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.product_name}</h1>
                <p className="text-gray-500 mt-2 leading-relaxed">{product.product_description}</p>
                
                <div className="mt-6 flex flex-wrap gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Size</label>
                    <select 
                      value={orderDetails.size}
                      onChange={(e) => setOrderDetails({...orderDetails, size: e.target.value})}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                    >
                      {['S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Quantity</label>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button 
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-50 active:bg-gray-100 border-r border-gray-200"
                      >-</button>
                      <span className="px-4 font-medium">{quantity}</span>
                      <button 
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 hover:bg-gray-50 active:bg-gray-100 border-l border-gray-200"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Selection */}
            <div className="mt-12">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'COD', label: 'Cash on Delivery', img: COD },
                  { id: 'Maya', label: 'Maya Wallet', img: Maya }
                ].map((method) => (
                  <label 
                    key={method.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      orderDetails.payment_method === method.id 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={method.img} alt="" className="w-8 h-8 object-contain" />
                      <span className="font-medium text-gray-700">{method.label}</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment"
                      className="accent-black w-4 h-4"
                      checked={orderDetails.payment_method === method.id}
                      onChange={() => setOrderDetails({...orderDetails, payment_method: method.id})}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Checkout Summary */}
          <div className="w-full md:w-80 bg-gray-50 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6">Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-500">
                  <span>Price per unit</span>
                  <span>₱{product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Quantity</span>
                  <span>x{quantity}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                  <span className="font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-black">₱{(product.price * quantity).toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 uppercase">VAT Included</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-black text-white font-bold py-4 rounded-2xl mt-12 hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
            >
              Complete Order
            </button>
          </div>
          
        </form>
      </main>
    </div>
  );
}