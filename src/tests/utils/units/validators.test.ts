import mongoose from "mongoose";
import * as validators from "../../../utils/validators";

describe("validate id", ()=>{
    it("should return false for invalid object id", ()=>{
        const result = validators.validateObjectId("0")
        expect(result).toBeFalsy()
    })
    it("should return true for valid object id", ()=>{
        const id = new mongoose.Types.ObjectId()
        const result = validators.validateObjectId(String(id))
        expect(result).toBeTruthy()
    })
})

describe("validate credentials", ()=>{
    const invalidCredentials = [
        {}, 
        {email: "testing@dev.co"}, 
        {password: "testing"}, 
        {email: "testing"},
        {password: "tes"},
        {email: "testing", password: "testing"},
        {email: "testing@gmail.com", password: "tes"}
    ]
    invalidCredentials.forEach(cred =>{
        it("should return error when invalid credential is passed", ()=>{
            const result = validators.validateCredentials(cred);
            expect(result.error).toBeDefined()
        })
        it("should not return error when valid credential is passed", ()=>{
            const result = validators.validateCredentials({email: "testing@gmail.com", password: "testing"})
            expect(result.error).not.toBeDefined()
        })
    })

})

describe("validate collection", ()=>{
    it("should not return error if valid collection object is passed", ()=>{
        const result = validators.validateCollection({title:"test"})
        expect(result.error).not.toBeDefined()
    })
    it("should not return error if valid collection object is passed", ()=>{
        const result = validators.validateCollection({})
        expect(result.error).toBeDefined()
    })
})