import { NextFunction, Request, Response } from "express";
import { sendInvalidEntry } from "../utils/responseHandlers";
import { validateObjectId } from "../utils/validators";

export default (req: Request, res: Response, next: NextFunction) =>{
    const params = Object.keys(req.params)
    for(let i = 0; i < params.length; i++){
        const param = params[i];
        if(param.toLowerCase().endsWith("id")){
        if(!validateObjectId(String(req.params[param])))return sendInvalidEntry(res,param)
        }
    }
    next()
}