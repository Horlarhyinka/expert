import * as responseHandlers from "../../../utils/responseHandlers";
import { Response } from "express";
import {MockRequest, MockResponse, createResponse } from "node-mocks-http";

describe("response handlers", ()=>{
    //not found
    it("should return response status 404",()=>{
        let res:Response = createResponse()
        responseHandlers.sendResourceNotFound(res)
        expect(res.statusCode).toBe(404)
    })
    //unauthenticated
    it("should return response status 401",()=>{
        let res:Response = createResponse()
        responseHandlers.sendUnauthenticated(res)
        expect(res.statusCode).toBe(401)
    })
    
    it("should return response status 400",()=>{
        let res:Response = createResponse()
        responseHandlers.sendInvalidEntry(res)
        expect(res.statusCode).toBe(400)
    })

    it("should return response status 400",()=>{
        let res:Response = createResponse()
        responseHandlers.sendMissingDependency(res)
        expect(res.statusCode).toBe(400)
        const case1 = responseHandlers.sendMissingDependency(res, "resource")
    })
})
