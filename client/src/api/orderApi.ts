import axios from "axios";

export async function orderProducts(user_id: number, product_id: number, token: string) {
    if (user_id == null || product_id == null) {
        console.log("Api does not receive the data");
        return;
    }
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders/orderProduct/${user_id}/${product_id}`, 
            {},
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