import multer from "multer";
import path from "path";
import cloudinary from "../config/cloudinary.config.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage= new CloudinaryStorage({
    cloudinary,
    params:(req,file)=>{

        const filename =`${Date.now()}-${Math.round(Math.random() * 1000000)}`;

        let folder="uploads"
        if(req.originalUrl.includes("/brand")) {
            folder="brand"
        }else if(req.originalUrl.includes("/product")) {
            folder="product"
        }

        return{
            folder,
            format:file.mimetype.split("/")[1],
            public_id:filename
        }
    }
});

const filter = (req,file,cb)=>{

    //validation
    const regex=/jpeg|jpg|png|svg|webp/
    const ext= path.extname(file.originalname).toLowerCase();
    const valid= regex.test(ext);

    (valid) ? cb(null,valid) : cb(new Error("Requires Image file"),valid);
}

const upload= multer({
    storage,
    fileFilter:filter,
    limits:{ fileSize: 2 * 1024 * 1024 }
});

export default upload;