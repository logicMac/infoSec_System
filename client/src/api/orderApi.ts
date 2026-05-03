import axios from "axios";

export async function orderProducts(token: string, product_id: number, quantity: number, totalPrice: string, orderDetails: any) {
    if (product_id == null || token == null) {
        console.log("Api does not receive the data");
        return;
    }
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders/orderProduct/${product_id}`, 
            {quantity, totalPrice, orderDetails},
            {
                headers: {
                    Authorization: `Bearer ${token}`    
                }
            }
        );

        const data = res.data

        if (!data.ok) {
            return {
                ok: false,
                msg: "Failed to order Product"
            }
        }

        return {
            ok: true,
            msg: "Order placed Successfully",
            data
        }

    } catch (error) {
        console.log(error);
    }
}

export async function deleteOrder(token: string, product_id: number) {
    try {
        
    } catch (error) {
        console.log(error);
    }
}