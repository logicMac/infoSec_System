import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/jpeg" || 
            file.mimetype === "image/png"  ||
            file.mimetype === "image/webp"
        ) {
            cb(null, true)
        } else {
            cb(new Error("Only images are allowed")) 
        }
    },
});

export default upload;