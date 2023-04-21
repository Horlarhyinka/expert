import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { user_int, collection_int } from "../models/types";
import { secureUrlRegex } from "../utils/regex";
dotenv.config()

cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,
secure: true
})

export const uploadImage = async(filename: string): Promise<string | null> =>{
    if(!filename)return null;
        const dir = path.resolve(__dirname, "../uploads/"+ filename)
    try{
    const {secure_url} = await cloudinary.uploader.upload(dir, {folder: "expert"})
    if(!secure_url){
        fs.unlink(dir, (err)=>{
            if(err)throw Error()
        });
        return null
    }
    fs.unlink(dir, (err)=>{
        if(err)throw Error()
    });
    if(!secureUrlRegex.test(secure_url))throw Error("invalid url type")
    return secure_url;
    }catch(ex){
        fs.unlink(dir, (err)=>{
            if(err)throw Error()
        });
        console.log(ex)
        return null
    }
}

export const uploadImages = async(arg: Request["files"]): Promise<(string | null)[] | null> =>{
    const files = arg as (Request["file"] | null)[]
    if(files.length < 1)return null;
    try{
        const result = await Promise.all(files!.map(async(file: Request["file"] | null)=>{
            const url = await uploadImage(file!.filename);
            if(url && !secureUrlRegex.test(url))throw Error("invalid url type")
            return url && url;
        }))
        return result
    }catch(ex){
        console.log("exeption",ex)
        return null
    }
}

export const destroyImage = async(url: string) =>{
    const id = getPublicId(url)
    if(!id)return null;
    const res = await cloudinary.uploader.destroy(id) 
    return res
}

function getPublicId(url: string | null){
    if(!url)return null;
    const idEnds = url.lastIndexOf(".")
    const idStarts = url.lastIndexOf("/")
    if(idStarts && idEnds){
    const publicId = url.slice(idStarts + 1, idEnds)
    if(publicId)return publicId;
    }
    return null
}

export const updateAvatar = async(Model: user_int | collection_int, filename: string)=>{
    const prevAvatar = Model.avatar
    if(prevAvatar){
        await destroyImage(prevAvatar)
    }
    const url = await uploadImage(filename!);
    if(url){
    if(!secureUrlRegex.test(url))throw Error("invalid url type")
    Model.avatar = url;
    const updated = await Model.save()
    return updated;
    }
    return null;
}