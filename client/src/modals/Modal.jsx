import { useRef } from "react";

export default function Modal({ isOpen, setIsOpen, onClose, children }) {
    if (!isOpen) return null;

    const fileInputRef = useRef(null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-transparent bg-opacity-50 shadow-lg"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-lg p-6 z-10">
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                    >
                        <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                {/* Header */}
                <div className="flex flex-col items-center justify-between mb-4 space-y-5 p-5">
                    <div className="flex flex-row items-center justify-b"> 
                        <h2 className="text-2xl font-bold text-gray-800">ADD PRODUCT</h2>
                    </div>

                    {/*Product name & header*/}
                    <div className="flex flex-col mt-5">
                        <div className="flex flex-row space-x-2.5">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="">Product name</label>
                                <input type="text" 
                                className="p-2 rounded-md border border-gray-400"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="">Description</label>
                                <input type="text" 
                                className="p-2 rounded-md border border-gray-400"
                                />
                            </div>
                        </div>

                        {/*Product price & stock*/}
                        <div className="flex flex-row mt-5 space-x-2.5">
                            <div className="flex flex-col ">
                                <label for="">price</label>
                                <input type="text" 
                                    className="p-2 rounded-md  border border-gray-400"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label for="">stock</label>
                                <input type="text" 
                                    className="p-2 rounded-md border border-gray-400"
                                />
                            </div>
                        </div>

                        {/*Product SKU & size*/}
                        <div className="flex flex-row mt-5 space-x-2.5">
                            <div className="flex flex-col ">
                                <label for="">SKU</label>
                                <input type="text" 
                                    className="p-2 rounded-md  border border-gray-400"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label for="">weight</label>
                                <input type="number"
                                    className="p-2 rounded-md border border-gray-400"
                                />
                            </div>
                        </div>

                         {/*Product SIZE & VARIANTS*/}
                        <div className="flex flex-row mt-5 space-x-2.5">
                            <div className="flex flex-col w-[50%]">
                                <label for="">size(optional)</label>
                                <select 
                                    name="" id="w-full"
                                    className="p-2 w-full border rounded-md border-gray-400"
                                >
                                    <option value="" disabled>Select size</option>
                                    <option value="M">M</option>
                                    <option value="S">S</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </select>
                            </div>

                            <div className="flex flex-col w-[50%]">
                                <label for="">variants</label>
                                <select
                                    name="variants"
                                    className="p-2 rounded-md border border-gray-400"
                                    placeholder="Variants"
                                >   
                                    <option value="" disabled>Select Variant</option>
                                    <option value="Red">Red</option>
                                    <option value="White">White</option>
                                    <option value="Black">Black</option>
                                    <option value="Green">Green</option>
                                    <option value="Orange">Orange</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-row mt-5 space-x-2.5">
                            <div className="flex flex-col w-[50%] space-y-2">
                                <label for="">Category</label>
                                <select className="p-2 rounded-md border border-gray-400">
                                    <option value="" disabled>Product Category</option>
                                    <option value="">Electronics</option>
                                    <option value="">Fashion</option>
                                    <option value="">Home & Living</option>
                                    <option value="">Skin care</option>
                                    <option value="">Toys</option>
                                    <option value="">Apparel</option>
                                    <option value="">Foods</option>
                                    <option value="">Health * Fitness</option>
                                    <option value="">Books</option>
                                    <option value="">Pet Supplies</option>
                                </select>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label for="">Brand</label>
                                <input 
                                    type="text"
                                    className="p-2 rounded-md border border-gray-400"
                                />
                            </div>
                        </div>

                        {/*Product image*/}
                        <div className="w-full mt-2">
                            <label for="">Image</label>

                            <input type="file" 
                                className="w-full h-30 border hidden"
                            />

                            {/* Custom Button */}
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className="flex flex-col items-center justify-center border-2 border-dashed h-32 rounded-lg cursor-pointer hover:bg-gray-100 transition  border border-gray-400"
                            >
                                <i className="fa-solid fa-image text-2xl mb-2"></i>
                                <p className="text-sm text-gray-600">Click to upload image</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-center space-x-2 w-full mt-5">
                        <button className="p-2 text-white bg-black rounded-md w-[40%] hover:scale-105 transition duration-200">Create</button>
                        <button 
                            className="p-2 text-black bg-white rounded-md w-[40%] border-1 hover:scale-105 transition duration-200"
                            onClick={() => setIsOpen(false)}
                            >
                                Cancel
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
