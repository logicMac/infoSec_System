import axios from "axios";
import { addProductParams, userDataParams } from "../types/types";

export async function addProduct(productData:addProductParams, userData: userDataParams) {
    if (!productData) {
        console.log("Api error plase try again");
        return;
    }
    
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/products/saveProduct`, 
            productData,
            {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                    "Content-Type" : "application/json",
                },
            }
        )
        
        const data = res.data;

        if (!data.ok) {
            return {
                ok: false,
                msg: data.msg || "Product addition failed"
            }
        }

        return {
            ok: true,
            msg: data.msg || "Product created successfully",
            product: data.product
        }

    } catch (err) {
        console.log(err);
        return{
            ok: false,
            msg: "Failed to send product to backend"
        }
    }
}

export async function deleteProduct(id: number) {
    if (!id) {
        return {
            ok: false,
            msg: "Product ID not sent to backend"
        }
    }

    try {
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/products/deletProduct/${id}`)
        
        const data = res.data;

        if (!data.ok) {
            return {
                ok: false,
                msg: "Failed to delete Product",
            }
        }

        return {
            ok: true,
            msg: "Product Deleted Successfully",
        }

    } catch (error) {
        console.log(error);
        return {
            ok :false, 
            msg: "Failed to send product to backend"
        }
    }
}