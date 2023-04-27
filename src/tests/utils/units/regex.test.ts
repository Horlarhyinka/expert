import * as regex from "../../../utils/regex";

describe("email regex", ()=>{
    it("should return false for invalid email address", ()=>{
        const result = regex.mailRegex.test("notamail")
        expect(result).toBeFalsy()
    })
    it("should return true for valid email address", ()=>{
        const result = regex.mailRegex.test("example@gmail.com")
        expect(result).toBeTruthy()
    })
})

describe("telephone regex", ()=>{
    it("should return false for invalid phone number", ()=>{
        const result = regex.telRegex.test("1234abc")
        expect(result).toBeFalsy()
    })
    it("should return true for valid phone number", ()=>{
        const result = regex.telRegex.test("+2341234567890")
        expect(result).toBeTruthy()
    })
})

describe("secure url regex", ()=>{
    it("should return false for non secure url", ()=>{
        const result = regex.secureUrlRegex.test("http://www.url.com")
        expect(result).toBeFalsy()
    })
    it("should return true for secure url", ()=>{
        const result = regex.secureUrlRegex.test("https://www.url.com")
        expect(result).toBeTruthy()
    })
})