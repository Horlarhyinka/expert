import { Request, Response } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import { getCache } from "../services/cache";
import { user_int } from "../models/types";

export const getChats = catchAsyncError(async(req: Request, res: Response)=>{
    const rooms = await getCache((req.user as user_int)._id) as string[] | null
    if(!rooms)return res.status(200).json([])
    const result = await Promise.all(rooms.map(async(room)=>{
        const chats = await getCache(room);
        return {room, chats}
    }))
    return res.status(200).json(result)
})

export const getRoomChat = catchAsyncError(async(req: Request, res: Response)=>{
    const { id } = req.params;
    if(!id)return res.status(400).json({message: "select room to view message"});
    let chats = await getCache(id) as string[] | null
    if(!chats){
        chats = []
    }
    return res.status(200).json(chats)
})