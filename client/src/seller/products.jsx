import { useState } from "react";
import NavBar from "./nav";
import Modal from "../modals/Modal.jsx";

export default function Products() {
    const[isOpen, setIsOpen] = useState(null);

    return(

        <div className=" bg-gray-100 h-full">
            <NavBar/>   

            <div className="flex flex-col m-10 space-y-2">
                <div className="flex flex-row justify-between items-start">
                    <p className="text-3xl font-semibold">Manage Products</p>

                    <div className="flex gap-4">
                        <button className="p-2 bg-black rounded-md text-white w-40">Add Product</button>
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
                        <tr className="text-center border-b border-gray-300">
                            <td className="px-4 py-4">Mac</td>
                            <td className="px-4 py-4">Dumas</td>
                            <td className="px-4 py-4">ates</td>   
                            <td className="px-4 py-4"></td>
                            <td className="px-4 py-4"></td>
                            <td className="px-4 py-4 gap-4">
                                <i className="fas fa-eye text-blue-500 hover:text-blue-700 cursor-pointer mx-1"></i>
                                <i className="fas fa-pen-to-square text-green-500 hover:text-green-700 cursor-pointer mx-1"></i>
                                <i className="fas fa-trash text-red-500 hover:text-red-700 cursor-pointer mx-1"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    );
}