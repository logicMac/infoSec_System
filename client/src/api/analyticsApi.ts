import axios from 'axios';

export async function getCustomerStats(customerId: number) {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/stats/:${customerId}`);

        const data = res.data;

        if (!data.succes) {
            return {
                ok: false,
                msg: data.msg || "Failed to get stats"
            }
        }

        return {
            data,
            msg: data.msg
        }

    } catch (err) {
        return {
            ok: false, 
            msg: "Internal Server Error"
        }
    }
}