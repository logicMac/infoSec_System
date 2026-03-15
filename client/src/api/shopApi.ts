import axios from "axios";

interface sellerParams{
    user_id: number,
    shop_name: string,
    shop_description: string,
    shop_logo: File,
    status: string,
    document_type: string,
    document_fle: File
}


export async function submitSellerApplication(sellerData: sellerParams) {
    if (!sellerData) {
        console.log("No data sent to API");
        return;
    }

    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/shops/submitSellerApplication`, sellerData);

        const data = res.data;

        if (!data.ok) {
            return {
                ok: false,
                msg: "failed to submit Application"
            }
        }

        return {
            ok: true,
            msg: "Application Submitted Successfully"
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: "Cannot send data to backend"
        }
    }
}