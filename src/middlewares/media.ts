import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: async(req, file, cb)=>{
        const dir =  path.resolve(__dirname, "../uploads")
        if(!fs.existsSync(dir)){
            fs.mkdir(dir, (err)=>{
                if(err)throw Error("error creating directory" + err)
                return cb(null, dir)
            })
        }
        return cb(null, dir)
    },
    filename: (req, file, cb) =>{
        const uniqueName = String(Date.now()) + String(Math.floor(Math.random() * 10e9)) + file.originalname
        return cb(null, uniqueName)
    }
})

const cf = multer({storage})

export const uploadOne = cf.single("image")

export const uploadMany = cf.array("image", 20)