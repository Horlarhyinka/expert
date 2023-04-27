import catchAsyncError from "../../../utils/catchAsyncError";
import { createResponse, createRequest } from "node-mocks-http";
import { Request, Response, NextFunction } from "express";

describe("catchAsyncError",()=>{
    it("should call the next function",()=>{
        const res: Response = createResponse();
        const req: Request = createRequest();
        const nextFunc = jest.fn() as NextFunction;
        const func = (req: Request, res: Response, next: NextFunction = nextFunc) =>{
            throw Error("error testing")
        }

        try{
            catchAsyncError(func)
        }catch(ex){
            expect(nextFunc).toHaveBeenCalledWith(ex)
        }
    })
})