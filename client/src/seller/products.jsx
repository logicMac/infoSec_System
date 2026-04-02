import { useEffect, useState } from "react";
import NavBar from "./nav";
import Modal from "../modals/Modal.jsx";
import { addProduct, getAllProduct } from "../api/productApi.js";
import { getAuthData } from "../utils/authGetter.js";

export default function Products() {
    const[isOpen, setIsOpen] = useState(false);
    const[error, setError] = useState('');
    const[data, setData] = useState([]);
    const [product, setProduct] = useState({
        product_name: '',
        product_description: '',
        price: 0,
        stock: 0,
        SKU: '',
        weight: 0,
        size: '',
        variants: '',
        category_name: '',
        brand: '',
        image: null
    });
    const {token, parsedUser} = getAuthData();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllProduct();
                console.log("API Response:", res);
            
                if (res.ok) {
                    console.log("Products data:", res.data);
                    setData(res.data);
                } else {
                    console.log("Error:", res.msg);
                    setError(res.msg);
                }

            } catch (err) {
                console.error("Fetch error:", err);
                setError("Something went wrong");
            }
        };

        fetchData();
    }, [])
    
    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!product) {
            console.log("No data sent to state");
            return;
        }

        if (!token) {
            console.log("No token attached");
            return;
        }

        if (parsedUser && parsedUser.role !== 'seller') {
            console.log("You cannot add product");
            return
        }

        // Create FormData for file upload
        const formData = new FormData();
        for (let key in product) {
            const value = product[key];
            if (value !== null) {
                formData.append(key, value);
            }
        }
        
        try {
            const res = await addProduct(formData, token);
            console.log(res.msg);

            if (res.ok) {
                setData(prev => [
                    ...prev, res.data
                ]);
            }

            if (res.ok) {
                setIsOpen(false);
                // Reset form
                setProduct({
                    product_name: '',
                    product_description: '',
                    price: 0,
                    stock: 0,
                    SKU: '',
                    weight: 0,
                    size: '',
                    variants: '',
                    category_name: '',
                    brand: '',
                    image: null
                });
            }

            if (!res.ok) {
                setError(res.msg);
            }
        } catch (err) {
            console.log("Cannot send data to API", err);        
        }       
    }

    return(

        <div className=" bg-gray-100 h-full">
            <NavBar/>   

            <div className="flex flex-col m-10 space-y-2">
                <div className="flex flex-row justify-between items-Qstart">
                    <p className="text-3xl font-semibold">Manage Products</p>

                    <div className="flex gap-4">
                        <button 
                            className="p-2 bg-black rounded-md text-white w-40 hover:scale-105 transiton duration-200"
                            onClick={() => {setIsOpen(true)}}
                            >
                                Add Product
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center m-10">
                <table className="w-full bg-white">
                    <thead className="">
                        <tr className="border-b border-gray-400 p-5">
                            <th className="px-4 py-4">ID</th>
                            <th className="px-4 py-4">Name</th>
                            <th className="px-4 py-4">Price</th>
                            <th className="px-4 py-4">Stock</th>
                            <th className="px-4 py-4">Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((product) => (
                            <tr 
                                key={product.product_id}
                                className="text-center border-b border-gray-300">
                                <div className="flex items-center justify-center w-20">
                                    <img className="object-cover" src={`http://localhost:3000/uploads/${product.image}`} />
                                </div>
                                <td className="px-4 py-4">{product.product_name}</td>
                                <td className="px-4 py-4">${product.price}</td>   
                                <td className="px-4 py-4">{product.stock}</td>
                                <td className="px-4 py-4">{product.category_name}</td>
                                <td className="px-4 py-4 gap-4">
                                    <i className="fas fa-eye text-blue-500 hover:text-blue-700 cursor-pointer mx-1"></i>
                                    <i className="fas fa-pen-to-square text-green-500 hover:text-green-700 cursor-pointer mx-1"></i>
                                    <i className="fas fa-trash text-red-500 hover:text-red-700 cursor-pointer mx-1"></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                product={product}
                setProduct={setProduct}
                handleAddProduct={handleAddProduct}
                error={error}
            />
        </div>
    );
}