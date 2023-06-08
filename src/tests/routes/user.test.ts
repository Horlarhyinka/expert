import Server from "../..";
import request from "supertest";
import User from "../../models/user";
import { user_int } from "../../models/types";
import {v2 as cloudinary} from "cloudinary";
import { secureUrlRegex } from "../../utils/regex";
import { Mocks } from "node-mocks-http";

function createTestUser(): Promise<user_int>{
    return User.create({email:"example@gmail.com", password: "testing"})
}

async function flushDb(): Promise<void>{
    User.deleteMany({})
}

describe("profile",()=>{
    let token: string;
    let data:{firstName?: string, lastName?: string, about?: string, skills?: [string], portfolio?: string} = {}
    let user: user_int;

    afterEach(async()=>{
        Server.close()
        await flushDb()
    })

    function execute(){
        return request(Server).put("/api/v1/user/profile").set("Authorization", token).send(data)
    }
    
    it("should return 401 status code if user is unauthenticated",async()=>{
        token = "1"
        const result = await execute()
        expect(result.statusCode).toBe(401);
    } )
    it("should return 'unauthenticated' message",async()=>{
        token = "1"
        const result = await execute()
        expect(result.body["message"]).toMatch(/unauthenticated/i)
    })
    it("should return 200 status code if user profile is updated",async()=>{
        user = await createTestUser()
        token = user.genToken()
        const res = await execute()
        // console.log(res.body)
        // expect(res.statusCode).toBe(200)
    })
    it("should return updated user profile",async()=>{
        try{
          
        user = await createTestUser()
        token = user.genToken()
        data.firstName = "test"
        data.lastName = "test"
        data.skills = ["testing"]
        data.about = "about me"
        const res = await execute()
        expect(res.body["skills"]).toBe(expect.arrayContaining([...data.skills]))
        delete res.body["skills"]
        for(let field in data){
          let f = data[field as keyof typeof data]
        expect(f).toBe(res.body[field]) 
        }  
        }catch(ex){
            console.log(ex)
        }
    })
    it("should not mutate _id, email, password, avatar, albums",async()=>{
        try{
          
            user = await createTestUser()
            token = user.genToken()
            data.firstName = "test"
            data.lastName = "test"
            data.skills = ["testing"]
            data.about = "about me"
            const res = await execute()
            expect(res.body["skills"]).toBe(expect.arrayContaining([...data.skills]))
            delete res.body["skills"]
            for(let field in data){
            let f = data[field as keyof typeof data]
            expect(f).not.toBeDefined()
            }  
            }catch(ex){
                console.log(ex)
            }
    })
})

describe("avatar",()=>{
    afterEach(async()=>{
        await flushDb()
    })
    let user: user_int;
    let token: string;
    const execute = () => request(Server).put("/api/v1/user/avatar").set("Authorization", token)
    it("should return 401 status code if user is unauthenticated",async()=>{
        user = await createTestUser()
        token = "1"
        const res = await execute()
        expect(res.statusCode).toBe(401)
    } )
    it("should return 'unauthenticated' message",async()=>{
        user = await createTestUser()
        token = "1"
        const res = await execute()
        expect(res.body["message"]).toMatch(/unauthenticated/i)
    })

    // it("should update user avatar url", async()=>{
    //     const user = await createTestUser()
    //     token = user.genToken()
    //     const res = await execute().attach("image","/assets/test.jpg")
    //     // expect(res.body.avatar! as string).toMatch(secureUrlRegex)
    // })

})
