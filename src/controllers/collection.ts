import { Request, Response } from "express";
import { user_int, user_model } from "../models/types";
import User from "../models/user";
import catchAsyncError from "../utils/catchAsyncError";
import { validateCollection, validateObjectId } from "../utils/validators";
import * as responseHandlers from "../utils/responseHandlers";
import Collection from "../models/collection";
import {pick } from "lodash";
import { destroyImage, updateAvatar, uploadImages } from "../services/media";
import { Types } from "mongoose";

export const createCollection = catchAsyncError(async(req: Request, res: Response)=>{
    const user = await User.findById((req.user as user_int)!._id);
    const {error} = validateCollection({...req.body});
    if(error){
        const messages = error.details.map(detail => detail.message.slice(0, detail.message.indexOf(":")))?.join(" \n")
        return res.status(400).json({message: messages})
    }
    const updatedUsercollection = await user!.addCollection(req.body)
    if(!updatedUsercollection)return responseHandlers.sendServerFailed(res, "add collection")
    return res.status(200).json(updatedUsercollection)
})

export const getCollections = catchAsyncError(async(req: Request, res: Response)=>{
    let user = req.user as user_int | null;
    if(!user){
        const id = req.query?.user
        if(!id)return res.redirect(301,"/api/v1/collections/all")
        if(!validateObjectId(String(id)!))return res.status(400).json({message: "invalid entry"})
        user = await (User as user_model).findById(id)
    }
    if(!user)return responseHandlers.sendResourceNotFound(res, "user")
    const collections = await user.getCollections()
    return res.status(200).json(collections);

})

export const getAllCollections = catchAsyncError(async(req: Request, res: Response)=>{
    const collections = await Collection.find()
    if(!collections)return responseHandlers.sendServerFailed(res, "get collections");
    return res.status(200).json(collections) 
})

export const getCollection = catchAsyncError(async(req: Request, res: Response)=>{
    const {id} = req.params
    if(!id)return responseHandlers.sendMissingDependency(res, "collection id")
    const collection = await Collection.findById(id)
    if(!collection)return responseHandlers.sendResourceNotFound(res, "collection")
    return res.status(200).json(collection)
})

export const removeCollection = catchAsyncError(async(req: Request, res: Response)=>{
    const {id } = req.params;
    if(!id)return responseHandlers.sendMissingDependency(res, "collection id");
    const collectionDeleted = await (req.user! as user_int).removeCollection(id)
    if(!collectionDeleted)return responseHandlers.sendServerFailed(res, "delete collection");
    return res.status(200).json(collectionDeleted)
})

export const updateUserCollection = catchAsyncError(async(req: Request, res: Response)=>{
    const {id } = req.params;
    if(!id)return responseHandlers.sendMissingDependency(res, "collection id");
    const {collections} = (req.user as user_int)!;
    const target = collections.find(c_id => String(c_id) === id)
    if(!target)return responseHandlers.sendResourceNotFound(res, "collection")
    const body = {...req.body}
    if(body.skills && !Array.isArray(body.skills)){
        delete body.skills
    }
    const updates = pick(body, ['title', "about", "skills", "portfolio"])
    const collection = await Collection.findByIdAndUpdate(String(target), {...updates},{new: true})
    if(!collection)return responseHandlers.sendServerFailed(res, "update collection")
    return res.status(200).json(collection)
})

export const updateCollectionAvatar = catchAsyncError(async(req: Request, res: Response)=>{
    if(!req.file)return responseHandlers.sendMissingDependency(res, "image file")
    const {id} = req.params;
    if(!id)responseHandlers.sendMissingDependency(res, "id");
    const target = (req.user as user_int).collections.find(c_id => String(c_id)===id)
    if(!target)return responseHandlers.sendResourceNotFound(res, "collection");
    const collection = await Collection.findById(id)
    if(!collection)return responseHandlers.sendResourceNotFound(res, "collection")
    const updated = await updateAvatar(collection, req.file.filename!);
    return res.status(200).json(updated)
})

export const addToAlbum = catchAsyncError(async(req: Request, res: Response)=>{
    const {id} = req.params;
    if(!id)responseHandlers.sendMissingDependency(res, "collection id")
    const targetId = (req.user as user_int).collections.find(c_id => String(c_id) === id) as Types.ObjectId | null;
    if(!targetId)return responseHandlers.sendResourceNotFound(res, "collection")
    const target = await Collection.findById(String(targetId))
    if(!target)return responseHandlers.sendResourceNotFound(res, "collection")
    if(!req.files)return responseHandlers.sendMissingDependency(res, "image files")
    const urls = await uploadImages(req.files)
    console.log({urls})
    if(!urls)return responseHandlers.sendServerFailed(res, "add image");
    const update = [...target.album, ...urls]
    target.album = update;
    const updated = await target.save();
    if(!updated)return responseHandlers.sendServerFailed(res, "update album");
    return res.status(200).json(updated)
})

export const removeFromAlbum = catchAsyncError(async(req: Request, res: Response)=>{
    const {id} = req.params;
    if(!id)return responseHandlers.sendMissingDependency(res, "collection id")
    const collection = await Collection.findById(id)
    if(!collection)return responseHandlers.sendResourceNotFound(res, "collection")
    const urls:(string)[] | undefined = req.body.urls
    if(!urls) return responseHandlers.sendMissingDependency(res, "urls")
    if(!Array.isArray(urls))return responseHandlers.sendInvalidEntry(res, "url list")
    await Promise.all(urls.map(async(url) =>{
        await destroyImage(url)
    }))
    collection.album = collection.album.filter(c_url => !urls.includes(c_url!))
    const updated = await collection.save()
    return res.status(200).json(updated)
})