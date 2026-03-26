export default function Modal({ isOpen, setIsOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-transparent bg-opacity-50 shadow-lg"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                    >
                        <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                {/* Header */}
                <div className="flex flex-col items-center justify-between mb-4 space-y-5">
                    <div className="flex flex-row items-center justify-b"> 
                        <h2 className="text-xl font-semibold text-gray-800">Add Product</h2>
                        
                    </div>

                    <div className="space-x-2">
                        <button className="p-2 text-white bg-black rounded-md w-30">Create</button>
                        <button className="p-2 text-black bg-white rounded-md w-30 border border-2">Cancel</button>
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
