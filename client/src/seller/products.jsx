import { useState } from "react";
import NavBar from "./nav";
import Modal from "../modals/Modal";

export default function Products() {
    const[isOpen, setIsOpen] = useState(null);

    return(

        <div className="bg-gray-100 h-full">
            <NavBar/>   

            <div className="flex justify-center items-center mt-5">
                <table className="w-full">
                    <thead>
                        <tr className="">
                            <th className="px-4">ID</th>
                            <th className="px-4">Name</th>
                            <th className="px-4">Price</th>
                            <th className="px-4">Stock</th>
                            <th className="px-4">Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="">Mac</td>
                            <td>Dumas</td>
                            <td>ates</td>
                            <td></td>
                        </tr>
                        <tr className="border-b">
                            <td className="">Mac</td>
                            <td>Dumas</td>
                            <td>ates</td>
                            <td></td>
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