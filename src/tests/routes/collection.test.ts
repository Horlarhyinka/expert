import {Request, Response} from "express";
import { createRequest, createResponse } from "node-mocks-http";
import User from "../../models/user";
import Collection from "../../models/collection";
import { user_int } from "../../models/types";
import Server from "../..";
import supertest from "supertest";


const flushDb = async() =>{
    await User.deleteMany({})
    await Collection.deleteMany({})
}

const createTestUser = (): Promise<user_int> =>User.create({email: "testing@test.test", password: "testing"})

describe("create collection",()=>{
    afterEach(async()=>{
        await flushDb()
    })
    let user: user_int
    let token: string = "1"
    type req_body = { title?: string , about?: string, skills?: string[], portfolio?: string }
    const execute = (body: req_body) =>supertest(Server).post("/api/v1/collections").set("Authorization", token).send(body)

    it("should return 401 unautenticated if token is not provided",async()=>{
    const res = await execute({title: "test 01"})
    expect(res.statusCode).toBe(401)
    expect(res.body["message"]).toMatch(/UNAUTHENTICATED/i)
    })

    it("should return 400 status code if title is not provided", async()=>{
        user = await createTestUser()
        token = user.genToken()
        const res = await execute({})
        expect(res.statusCode).toBe(400)
    })

    it("should return 201 status code",async()=>{
        user = await createTestUser()
        token = user.genToken()
        const res = await execute({title: "TESTING"})
        console.log(res.body)
        expect(res.statusCode).toBe(201)
    })
})

describe("update collection",()=>{
    it("should return unauthenticated if no/invalid token is provided",async()=>{

    })
    it("should return 400 if invalid ID param is provided", async()=>{

    })
    it("should return 404 status code if collection is not found", async()=>{

    })
    it("should return 200 status if collection is updated", async()=>{

    })
})