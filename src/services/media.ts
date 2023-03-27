import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { Request } from "express";
dotenv.config()

cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,
secure: true
})

export const uploadImage = async(filename: string): Promise<string | null> =>{
    if(!filename)return null;
    try{
        const dir = path.resolve(__dirname, "../uploads/"+ filename)
    const {secure_url} = await cloudinary.uploader.upload(dir)
    if(!secure_url){
        fs.unlink(dir, (err)=>{
            if(err)throw Error()
        });
        return null
    }
    fs.unlink(dir, (err)=>{
        if(err)throw Error()
    });
    return secure_url;
    }catch(ex){
        console.log(ex)
        return null
    }
}

export const uploadImages = async(arg: Request["files"]): Promise<(string | null)[] | null> =>{
    const files = arg as (Request["file"] | null)[]
    if(files.length < 1)return null;
    try{
        return Promise.all(files!.map(async(file: Request["file"] | null)=>{
            const url = await uploadImage(file!.filename);
            return url && url;
        }))
    }catch(ex){
        console.log(ex)
        return null
    }
}