import { useState, useEffect } from "react";
import CustomerNavbar from "./navbar";
import { toast, Toaster } from "sonner"; // Fixed casing: 'Toaster'
import { getAuthData } from "../utils/authGetter";

export default function CustomerOrders() {
    const [id, setId] = useState(null);
    const [orderData, setOrderData] = useState([
        // Mock data structure to show off the new UI design layout
        { id: 1, product: "Premium Crop Fertilizer", price: 45.00, payment_method: "GCash", status: "Pending" },
        { id: 2, product: "Organic Pest Control Spray", price: 29.99, payment_method: "Bank Transfer", status: "Completed" }
    ]);

    const handleGetOrders = async () => {
        try {
  
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to fetch orders");     
        }
    } 

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-center" />
            <CustomerNavbar />
            
            <div className="p-10 flex flex-col items-center justify-center max-w-6xl mx-auto">
                <div className="w-full mb-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Your Orders</h1>
                </div>
                <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr className="text-xs font-semibold text-gray-600 uppercase tracking-wider">    
                                <th className="px-10 py-4">Product</th>         
                                <th className="px-10 py-4">Price</th>
                                <th className="px-10 py-4">Payment Method</th>
                                <th className="px-10 py-4">Status</th>
                                <th className="px-10 py-4 text-center">Action</th>
                            </tr>   
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">    
                            {orderData.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-10 py-4 font-medium text-gray-900">{order.product}</td>
                                    <td className="px-10 py-4">${order.price.toFixed(2)}</td>
                                    <td className="px-10 py-4">{order.payment_method}</td>
                                    <td className="px-10 py-4">
                                        {/* Status Badge Customization */}
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            order.status === 'Completed' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex justify-center items-center gap-2">       
                                            <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition">
                                                View
                                            </button>       
                                            <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition">
                                                Cancel
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}