import mongoose from "mongoose";
import {Request, Response, NextFunction} from "express";
import { sendMissingDependency } from "../utils/responseHandlers";

export default (req: Request, res: Response, next: NextFunction) =>{
    const params = Object.keys(req.params)
    if(params.length < 0)return sendMissingDependency(res, "id parameter");
    for(let i = 0; i < params.length; i++){
        const param = params[i]
        if(param.toLowerCase().endsWith("id")){
            if(!validateId(req.params[param]))return res.status(400).json({message: "invalid "+ param})
            }
    }
    return next()
    function validateId(id: string){
        return mongoose.Types.ObjectId.isValid(id)
    }
}