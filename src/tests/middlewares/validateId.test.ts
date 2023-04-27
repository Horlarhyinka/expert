import validateId from "../../middlewares/validateId";
import { createRequest, createResponse } from "node-mocks-http";
import {Request, Response, NextFunction} from "express";
import mongoose from "mongoose";

describe("validate id",()=>{
    let req: Request;
    let res: Response;
    let next: NextFunction;
    function execute(){
        return validateId(req, res, next)
    }
    it("should return 400 status code if invalid object id is provided for a param key ending with 'id'",()=>{
        req = createRequest();
        req.params["id"] = "1";
        res = createResponse();
        next = jest.fn()
        const result = execute();
        expect(result?.statusCode).toBe(400);
    })
    it("should not return 400 status code if invalid object id is provided for a param key not ending with 'id'",()=>{
        req = createRequest();
        req.params["test"] = "1";
        res = createResponse();
        next = jest.fn()
        const result = execute();
        expect(result?.statusCode).not.toBe(400);
    })
    it("should call next function if invalid object id is provided for a param key not ending with 'id'",()=>{
        req = createRequest();
        req.params["test"] = "1";
        res = createResponse();
        next = jest.fn()
        const result = execute();
        expect(next).toHaveBeenCalled();
    });
    it("should call next function if valid object id is provided for a param key ending with 'id'",()=>{
        req = createRequest();

        req.params["id"] = String(new mongoose.Types.ObjectId());
        res = createResponse();
        next = jest.fn()
        const result = execute();
        expect(next).toHaveBeenCalled();
    })
})