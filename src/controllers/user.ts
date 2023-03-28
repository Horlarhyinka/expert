import User from "../models/user";
import { Request, Response } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import { user_int } from "../models/types";
import * as responseHandlers from "../utils/responseHandlers";

export const updateProfile = catchAsyncError(async(req: Request, res: Response)=>{
    const user = await User.findById((req.user as user_int)._id)
    if(!user)return responseHandlers.sendResourceNotFound(res, "user")
    const profile = await user!.updateProfile(req.body);
    if(!profile)return user;
    profile!.password = ""
    return res.status(201).json(profile);
})