import axios from 'axios';

export async function getCustomerStats(customerId: number) {
    try {
        console.log(`[Frontend] Fetching stats for customer ID: ${customerId}`);
        
        const res = await axios.get(`${import.meta.env?.VITE_API_URL}/stat/stats/${customerId}`);

        const data = res.data;
        
        console.log("[Frontend] Stats response:", data);

        if (!data.success) {
            return {
                ok: false,
                msg: data.msg || "Failed to get stats"
            }
        }

        return {
            ok: true,
            data: data.data,
            msg: data.msg
        }

    } catch (err: any) {
        console.error("[Frontend] Stats error:", err.response?.data || err.message);
        return {
            ok: false, 
            msg: err.response?.data?.msg || "Internal Server Error"
        }
    }
}