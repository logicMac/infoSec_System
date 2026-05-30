import { ok } from "assert";
import axios from "axios";

// Order product endpoint
export async function orderProducts(token: string, product_id: number, quantity: number, orderDetails: any) {
    if (product_id == null || token == null) {
        return {
                ok: false, 
                msg: "Missing credentials or target data" 
            };
    }
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders/orderProduct/${product_id}`, 
            { quantity, orderDetails },
            {
                headers: {
                    Authorization: `Bearer ${token}`    
                }
            }
        );

        const data = res.data;

        if (!data.success) {
            return {
                ok: false,
                msg: data.msg || "Failed to order Product"
            };
        }

        return {
            ok: true,
            msg: data.msg || "Order placed Successfully",
            data
        };

    } catch (error: any) {
        return { 
            ok: false, 
            msg: "An unexpected error occurred.", 
            error 
        };
    }
}

export async function deleteOrder(token: string, product_id: number) {
    if (token === null || product_id === null) {
        return {
            ok: false, 
            msg: "Missing auth or product data"
        }
    }

    try {
        const res = axios.delete(`${import.meta.env.VITE_API_URL}/orders/cancelOrder/${product_id}`,
            {
                headers: {
                    Authorization: `Bearer + ${token}`
                }
            }
        );

        const data = res.data; 

        if (!data.success) {
            return {
                ok: false,
                msg: data.msg || "Failed to cancel order" 
            }
        } 

        return {
            ok: true,
            data
        }

    } catch (error) {
        return {
            ok: false,
            msg: error instanceof Error || "Internal server Error"
        }
    }
}

//Get Customer Order endpoint 
export async function getCustomerOrders(customerId: number) {
    try {
         const res = await axios.get(`${import.meta.env.VITE_API_URL}/customers/getCustomerOrders/${customerId}`);

         const data = res.data;

         if (!data.success) {
            return {
                ok: false,
                msg: "Failed to fetch order data"
            }
         }

         return {
            ok: true,
            data: data
         }
    } catch (error) {
        return {
            ok: false,
            msg: error instanceof Error || "Internal Server Error"
        }
    }
}