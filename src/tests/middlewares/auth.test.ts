import auth from "../../middlewares/auth";
import { createRequest, createResponse } from "node-mocks-http";
import {Request, Response, NextFunction} from "express";
import Server from "../..";
import User from "../../models/user";
import { user_int } from "../../models/types";

afterEach(()=>Server.close())

describe("auth middleware", ()=>{
    let user: user_int;
    let token: string;
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(async()=>{
        user = await User.create({ email: "testing@test.co", password: "testing"})
    })

    afterEach(async()=>{
        await User.deleteMany({})
        Server.close()
    })

    function execute(){
        req.headers.authorization = token
        return auth(req, res, next)
    }

    it("should return status 401 if no token is provided", async()=>{
        req = createRequest();
        res = createResponse();
        next = jest.fn() as NextFunction;
        execute()
        expect(res.statusCode).toBe(401)
    })
    it("should return status 401 if invalid token is provided", async()=>{
        req = createRequest();
        res = createResponse();
        next = jest.fn() as NextFunction;
        token = "1"
        execute()
        expect(res.statusCode).toBe(401)
    })
    it("should return status 401 if invalid token is provided", async()=>{
        req = createRequest();
        res = createResponse();
        next = jest.fn() as NextFunction;
        token = "1"
        execute()
        expect(res.statusCode).toBe(401)
    })
    it("should call next function if valid token is provided", async()=>{
        req = createRequest();
        res = createResponse();
        next = jest.fn() as NextFunction;
        token = user.genToken()
        await execute()
        expect(next).toHaveBeenCalled()
    })
})