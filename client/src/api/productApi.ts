import axios from "axios";
import { addProductParams, userDataParams } from "../types/types";

export async function addProduct(productData:addProductParams, token: string) {
    if (!productData) {
        console.log("Api error plase try again");
        return;
    }

    if (!token) {
        console.log("No token provided");
        return;
    }
    
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/products/saveProduct`, 
            productData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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

export async function deleteProduct(token: string, id: number) {
    if (!id) {
        return {
            ok: false,
            msg: "Product ID not sent to backend"
        }
    }

    try {
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/products/deleteProduct/${id}`,
            {
                headers: {      
                    Authorization:  `Bearer ${token}`,
                }
            }
        )
        
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

export async function updateProduct(productData: string, id: number, token: string) {
    if(!token || token === undefined) {
        return {
            ok: false,
            msg: "No token sent to API"
        }
    }

    try {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/products/updateProduct/${id}`, 
            productData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const data = res.data;

        if (!data.ok) {
            return {
                ok: false,
                msg: data.msg
            }
        }

        return {
            ok: true,
            msg: "Product Updated Successfully",
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: "Failed to send productData to backend"
        }
    }
}

export async function getAllProduct() {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/getProducts`);

        const data = res.data;
        console.log("Backend response:", data);

        if (!data.success) {
            return {
                ok: false,
                msg: data.msg || "Error Fetching products"
            }
        }

        return {
            ok: true,
            msg: data.msg || "Products Fetched",
            data: data.products
        }
    } catch (err) {
        console.error("Fetch error:", err);

        return {
            ok: false,
            msg: "Cannot fetch data from backend"
        };
    }
}