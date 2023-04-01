import {Request, Response} from "express";
import { sendResourceNotFound } from "../utils/responseHandlers";

export default (req: Request, res: Response)=>{
    return sendResourceNotFound(res)
}