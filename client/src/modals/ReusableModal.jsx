export default function DeleteModal({ isDeleteOpen, setIsDeleteOpen, handleDelete }) {
    if (!isDeleteOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            
        

            {/* Content */}
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-[350px] p-6 text-center">

                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-yellow-100 text-yellow-500 p-4 rounded-full">
                        <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-xl font-semibold text-gray-800 mb-2">
                    Delete Product?
                </h1>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-6">
                    This action cannot be undone. Are you sure you want to delete this item?
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                        onClick={handleDelete} // ✅ FIXED
                    >
                        Delete
                    </button>

                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
                        onClick={() => setIsDeleteOpen(false)} // ✅ FIXED
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
}