import User from "../models/user";
import { Request, Response } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import { collection_int, user_int } from "../models/types";
import * as responseHandlers from "../utils/responseHandlers";
import { updateAvatar } from "../services/media";

export const updateProfile = catchAsyncError(async(req: Request, res: Response)=>{
    const user = await User.findById((req.user as user_int)._id)
    if(!user)return responseHandlers.sendResourceNotFound(res, "user")
    const profile = await user!.updateProfile(req.body);
    if(!profile)return user;
    profile!.password = ""
    return res.status(200).json(profile);
})

export const updateUserAvatar = catchAsyncError(async(req: Request, res: Response)=>{
    if(!req.file)return responseHandlers.sendMissingDependency(res, "image file")
    const updated = await updateAvatar(req.user as user_int, req.file.filename!);
    if(!updated)return responseHandlers.sendServerFailed(res, "upload profile")
    return res.status(200).json(updated)
})

export const getExperts = catchAsyncError(async(req: Request, res: Response)=>{
    let users = await User.find().select("-password")
    const search = req.query.search
    if(search){
    users = users.filter((user: user_int)=>user.about?.includes((String(search))))
    }
    return res.status(200).json(users)
})

export const getExpert = catchAsyncError(async(req: Request, res: Response)=>{
    const {id} = req.params;
    if(!id)return responseHandlers.sendMissingDependency(res, "id")
    let user = await User.findById(id).select("-password")
    if(!user)return responseHandlers.sendResourceNotFound(res, "user");
    return res.status(200).json(user)
})