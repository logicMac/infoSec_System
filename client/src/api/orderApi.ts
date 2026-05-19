import axios from "axios";


// Order product endpoint
export async function orderProducts(token: string, product_id: number, quantity: number, orderDetails: any) {
    if (product_id == null || token == null) {
        console.log("Api does not receive the data");
        return { ok: false, msg: "Missing credentials or target data" };
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

        if (!data.ok) {
            return {
                ok: false,
                msg: data.msg || "Failed to order Product"
            };
        }

        return {
            ok: true,
            msg: "Order placed Successfully",
            data
        };

    } catch (error: any) {
        console.log("orderProducts error response:", error?.response?.data || error);
        return { ok: false, msg: "An unexpected error occurred.", error };
    }
}

export async function deleteOrder(token: string, product_id: number) {
    try {
        
    } catch (error) {
        console.log(error);
    }
}