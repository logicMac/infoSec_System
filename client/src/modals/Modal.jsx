import { useRef, useState } from "react";

export default function Modal({ isOpen, setIsOpen, onClose, children, handleAddProduct, setProduct, product, error }) {
    if (!isOpen) return null;

    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    // Generic handler for text, number, select inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file input
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduct(prev => ({
                ...prev,
                image: file
            }));
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-transparent bg-opacity-50 shadow-lg"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <form 
                onSubmit={handleAddProduct}
                className="relative bg-white rounded-lg shadow-lg p-6 z-10">
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                    >
                        <i className="fa-solid fa-xmark text-2xl"></i>
                </button>

                <div className="flex flex-col items-center justify-between mb-4 space-y-5 p-5">
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="text-2xl font-bold text-gray-800">ADD PRODUCT</h2>
                        <p className="text-red-500">{error}</p>
                    </div>

                    {/* Product inputs */}
                    <div className="flex flex-col mt-5 space-y-5">
                        <div className="flex space-x-2.5">
                            <div className="flex flex-col space-y-2">
                                <label>Product name</label>
                                <input 
                                    type="text"
                                    name="product_name"
                                    value={product.product_name}
                                    onChange={handleChange}
                                    className="p-2 rounded-md border border-gray-400"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label>Description</label>
                                <input 
                                    type="text"
                                    name="product_description"
                                    value={product.product_description}
                                    onChange={handleChange}
                                    className="p-2 rounded-md border border-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-2.5">
                            <div className="flex flex-col">
                                <label>Price</label>
                                <input 
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    className="p-2 rounded-md border border-gray-400"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Stock</label>
                                <input 
                                    type="number"
                                    name="stock"
                                    value={product.stock}
                                    onChange={handleChange}
                                    className="p-2 rounded-md border border-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-2.5">
                            <div className="flex flex-col">
                                <label>SKU</label>
                                <input 
                                    type="text"
                                    name="SKU"
                                    value={product.SKU}
                                    onChange={handleChange}
                                    className="p-2 rounded-md border border-gray-400"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Weight</label>
                                <input 
                                    type="number"
                                    name="weight"
                                    value={product.weight}
                                    onChange={handleChange}
                                    className="p-2 rounded-md border border-gray-400"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-2.5">
                            <div className="flex flex-col w-[50%]">
                                <label>Size</label>
                                <select
                                    name="size"
                                    value={product.size}
                                    onChange={handleChange}
                                    className="p-2 w-full border rounded-md border-gray-400"
                                >
                                    <option value="" disabled>Select size</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </select>
                            </div>
                            <div className="flex flex-col w-[50%]">
                                <label>Variants</label>
                                <select
                                    name="variants"
                                    value={product.variants}
                                    onChange={handleChange}
                                    className="p-2 rounded-md border border-gray-400"
                                >
                                    <option value="" disabled>Select variant</option>
                                    <option value="Red">Red</option>
                                    <option value="White">White</option>
                                    <option value="Black">Black</option>
                                    <option value="Green">Green</option>
                                    <option value="Orange">Orange</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex space-x-2.5">
                            <div className="flex flex-col w-[50%]">
                                <label>Category</label>
                                <select
                                    name="category_name"
                                    value={product.category_name}
                                    onChange={handleChange}
                                    className="p-2 rounded-md border border-gray-400"
                                >
                                    <option value="" disabled>Select category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Home & Living">Home & Living</option>
                                    <option value="Skin care">Skin care</option>
                                    <option value="Toys">Toys</option>
                                    <option value="Apparel">Apparel</option>
                                    <option value="Foods">Foods</option>
                                    <option value="Health & Fitness">Health & Fitness</option>
                                    <option value="Books">Books</option>
                                    <option value="Pet Supplies">Pet Supplies</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label>Brand</label>
                                <input 
                                    type="text"
                                    name="brand"
                                    value={product.brand}
                                    onChange={handleChange}
                                    className="p-2 rounded-md border border-gray-400"
                                />
                            </div>
                        </div>

                        {/* Image */}
                        <div className="flex flex-col mt-2">
                            <label>Image</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-3 w-full h-40 object-cover rounded-md border"
                                />
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    className="flex flex-col items-center justify-center border-2 border-dashed h-32 rounded-lg cursor-pointer hover:bg-gray-100 transition border-gray-400"
                                >
                                    <i className="fa-solid fa-image text-2xl mb-2"></i>
                                    <p className="text-sm text-gray-600">Click to upload image</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center space-x-2 mt-5 w-full">
                        <button 
                            type="submit"
                            className="p-2 text-white bg-black rounded-md w-[40%] hover:scale-105 transition duration-200"
                        >
                            Create
                        </button>
                        <button 
                            type="button"
                            className="p-2 text-black bg-white rounded-md w-[40%] border hover:scale-105 transition duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {children}
            </form>
        </div>
    );
}

