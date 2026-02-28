import multer from "multer";
import path from "path";

//configure storage destination
const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, "uploads/");
    },
    //config file name 
    filename: function(req, file, cb) {
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }   
});

//validation of file type
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    //only types that is allowed 
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    //validate if the file is actually an image
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        //throw error if file is not an image
        cb(new Error("Only images are allowed"));
    }
}

//upload logics, size of the image
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})

export default upload;
