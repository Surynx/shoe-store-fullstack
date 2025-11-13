import multer from "multer";
import path from "path";

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{

        if(req.originalUrl.includes("/brand")) {
            cb(null,"uploads/brand/");
        }else if(req.originalUrl.includes("/product")) {
            cb(null,"uploads/product/")
        }

    },
    filename:(req,file,cb)=>{
        
        const filename = Date.now()+"-"+Math.round(Math.random() * 1000000)+path.extname(file.originalname);
        cb(null,filename)
    }
});

const filter = (req,file,cb)=>{

    const allowed_format="/jpeg|jpg|png|svg|webp/"
    const valid= allowed_format.test(path.extname(file.originalname).toLowerCase());

    (valid) ? cb(null,valid) : cb(new Error("Requires Image file"),valid);
}

const upload= multer({
    storage,
    filter,
    limits:{ fileSize: 2 * 1024 * 1024 }
});

export default upload;