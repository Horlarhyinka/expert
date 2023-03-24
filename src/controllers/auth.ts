import User from "../models/user";
import { Request, Response } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import { sendDuplicateResource, sendMissingDependency, sendResourceNotFound } from "../utils/responseHandlers";
import { validateCredentials } from "../utils/validators";
import { pick } from "lodash";
import { MongooseError } from "mongoose";
import crypto from "crypto";
import Mailer from "../services/mail";
import { user_int } from "../models/types";

export const register = catchAsyncError(async(req: Request, res: Response) =>{
    const {email, password} = req.body;
    if(!email || !password)return sendMissingDependency(res, "email and password");
    try{
        const {error} = validateCredentials({...req.body})
        if(error){
            const messages = error.details.map(detail => detail.message.slice(0, detail.message.indexOf(":")))?.join(" \n")
            return res.status(400).json({message: messages})
        }
        const duplicated = await User.findDuplicate(email)
        if(duplicated)return sendDuplicateResource(res, "email")
        const user = await User.create({...req.body})
        const token = user.genToken()
        return res.status(201).json({user: pick(user, ["email", "collections"]), token})
    }catch(ex: any | MongooseError){
        const errorMessages = Object.keys(ex.errors).map((key: string )=>{
            return ex.errors[key].properties?.message
        })
        return res.status(400).json({message: errorMessages.join(" \n")})
    }
})

export const login = catchAsyncError(async(req: Request, res: Response)=>{
    const {email, password} = req.body;
    if(!email || !password) return sendMissingDependency(res, "email and password")
    const user = await User.findOne({email})
    if(!user)return sendResourceNotFound(res, "user")
    const verifiedPassword = await user.verifyPassword(password)
    if(!verifiedPassword)return res.status(400).json({message: "incorrect password"})
    const token = user.genToken()
    return res.status(200).json({user: pick(user, ["email", "collections"]), token})
})

export const forgetPassword = catchAsyncError(async(req: Request, res: Response)=>{
    const {email} = req.body;
    if(!email) return sendMissingDependency(res, "email")
    const user = await User.findOne({email})
    if(!user) return sendResourceNotFound(res, "res")
    const token = crypto.randomBytes(21).toString("utf8")
    user.resetToken = token
    user.tokenExpiresIn = new Date(Date.now() + 7200) //expires in two hours
    await user.save()
    const mailer = new Mailer(email)
    const link = process.env.BASE_URL! + "/" + token
    await mailer.sendPasswordResetToken(link)
    return res.status(203).json({message: `check ${email} inbox to complete action`})
})

export const resetPassword = catchAsyncError(async(req: Request, res: Response)=>{
    const { token } = req.params;
    if(!token)return sendMissingDependency(res)
    const user = await User.findOne({resetToken: token, tokenExpiresIn:{$lte: new Date()}})
    if(!user)return sendResourceNotFound(res)
    const {password, confirmPassword} = req.body
    if(!password || !confirmPassword) return sendMissingDependency(res, "password and confirm password")
    if(password !== confirmPassword) return res.status(400).json({message: "password must match confirm password"})
    user.set("password", password)
    user.set("resetToken", undefined)
    user.set("tokenExpiresIn", undefined)
    await user.save()
    const authToken = user.genToken()
    return res.status(200).json({user: pick(user, ["email", "collections"]), token: authToken})
})

export const googleOauthCallback = catchAsyncError(async(req: Request, res: Response)=>{
    const {email, password} = req.user as user_int
    const user = await User.findOne({email, password})
    if(!user)return sendResourceNotFound(res)
    const token =  user.genToken()
    return res.status(200).json({user: pick(user, ["email", "collections"]), token})
})