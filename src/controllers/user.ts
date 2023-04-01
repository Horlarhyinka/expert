import User from "../models/user";
import { Request, Response } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import { collection_int, user_int } from "../models/types";
import * as responseHandlers from "../utils/responseHandlers";
import { destroyImage, uploadImage } from "../services/media";
import Collection from "../models/collection";
import { updateAvatar } from "../services/media";

export const updateProfile = catchAsyncError(async(req: Request, res: Response)=>{
    const user = await User.findById((req.user as user_int)._id)
    if(!user)return responseHandlers.sendResourceNotFound(res, "user")
    const profile = await user!.updateProfile(req.body);
    if(!profile)return user;
    profile!.password = ""
    return res.status(201).json(profile);
})

export const updateUserAvatar = catchAsyncError(async(req: Request, res: Response)=>{
    if(!req.file)return responseHandlers.sendMissingDependency(res, "image file")
    const updated = await updateAvatar(req.user as user_int, req.file.filename!);
    if(!updated)return responseHandlers.sendServerFailed(res, "upload profile")
    return res.status(200).json(updated)
})