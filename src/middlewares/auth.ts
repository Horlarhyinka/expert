import User from "../models/user";
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendUnauthenticated } from "../utils/responseHandlers";
dotenv.config()

export default async(req: Request, res: Response, next: NextFunction) =>{
    try{
    const headerToken = req.headers["authorization"]
    if(!headerToken)return sendUnauthenticated(res)
    const formatted = jwt.verify(headerToken, process.env.SECRET!)as jwt.JwtPayload;
    const {id} = formatted
    if(!id)return sendUnauthenticated(res)
    const user = await User.findById(id)
    if(!user)return sendUnauthenticated(res)
    req.user = user;
    next()
}catch(ex){
        console.log(ex)
        return sendUnauthenticated(res)
    }
}