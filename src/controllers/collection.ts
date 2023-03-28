import { Request, Response } from "express";
import { user_int } from "../models/types";
import User from "../models/user";
import catchAsyncError from "../utils/catchAsyncError";
import { validateCollection } from "../utils/validators";
import * as responseHandlers from "../utils/responseHandlers";
import Collection from "../models/collection";

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
    let user = req.user as user_int;
    const collections = await user.getCollections()
    console.log(collections)
    return res.status(200).json(collections);
})

export const getAllcollections = catchAsyncError(async(req: Request, res: Response)=>{
    const collections = await Collection.find()
    if(!collections)return responseHandlers.sendServerFailed(res, "get collections");
    return res.status(200).json(collections) 
})

export const removeCollection = catchAsyncError(async(req: Request, res: Response)=>{
    const {id } = req.params;
    if(!id)return responseHandlers.sendMissingDependency(res, "collection id");
    const collectionDeleted = await (req.user! as user_int).removeCollection(id)
    if(!collectionDeleted)return responseHandlers.sendServerFailed(res, "delete collection");
    return res.status(200).json(collectionDeleted)
})

