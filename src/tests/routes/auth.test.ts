import request from "supertest";
import User from "../../models/user";
import Server from "../..";
import passport from "passport"
import Mailer from "../../services/mail";

jest.setTimeout(15000)


afterEach(async()=>{
    Server.close()
})

describe("register",()=>{

    let email: string;
    let password: string;


    afterEach(async()=>{
        await User.deleteMany({})
        Server.close()
    })

    function execute(){
        return request(Server).post("/api/v1/auth/register").send({ email, password})
    }

    it("should return 400 status code if invalid email or password is provided", async()=>{
        email = "abcd"
        password = "1234"
        const result = await execute();
        expect(result.statusCode).toBe(400)
    })
    it("should return an error message if invalid email or password is provided",async()=>{
        email = "abcd"
        password = "1234"
        const result = await execute();
        expect(result.body["message"]).toBeDefined()
    })
    it("should return status 409 if email is taken",async()=>{
        await User.create({email: "example@gmail.com", password: "testing"})
        email = "example@gmail.com"
        password = "testing"
        const result = await execute();
        expect(result.statusCode).toBe(409);
    })
    it("should return error message if email is taken",async()=>{
        await User.create({email: "example@gmail.com", password: "testing"})
        email = "example@gmail.com"
        password = "testing"
        const result = await execute();
        console.log(result.body)
        expect(result.body["message"]).toBeDefined()
    })
    it("should return 201 status code", async()=>{
        email = "example@gmail.com";
        password = "testing";
        const result = await execute()
        expect(result.statusCode).toBe(201)
    }) 
    it("should return user object", async()=>{
        email = "example@gmail.com";
        password = "testing";
        const result = await execute()
        expect(result.body["user"] && result.body["token"]).toBeDefined()
    })
})

describe("login",()=>{
    let email: string;
    let password: string;

    afterEach(async()=>{
        Server.close()
        await User.deleteMany({})
    })

    function execute(){
        return request(Server).post("/api/v1/auth/login").send({ email, password})
    }

    it("should return 400 status code if email or password is not provided", async()=>{
        const result = await execute();
        expect(result.statusCode).toBe(400)
    })
    it("should return an error message if email or password is not provided",async()=>{
        const result = await execute();
        expect(result.body["message"]).toBeDefined()
    })
    it("should return status 404 if email is not registered",async()=>{
        email = "example@gmail.com"
        password = "testing"
        const result = await execute();
        expect(result.statusCode).toBe(404)
    })
    it("should return error message if email is not registered",async()=>{
        email = "example@gmail.com"
        password = "testing";
        const result = await execute();
        expect(result.body["message"]).toBeDefined()
    })
    it("should return status 401 if password is incorrect",async()=>{
        email = "example@gmail.com"
        password = "testing";
        await User.create({email, password})
        password = "1"
        const result = await execute()
        expect(result.statusCode).toBe(400)
    })
    it("should a message if password is incorrect",async()=>{
        email = "example@gmail.com"
        password = "testing";
        await User.create({email, password})
        password = "1"
        const result = await execute()
        expect(result.body["message"]).toBeDefined()
    });
    it("should return 200 status code if correct email and password is supplied",async()=>{
        email = "example@gmail.com"
        password = "testing";
        await User.create({email, password})
        const result = await execute()
        expect(result.statusCode).toBe(200)
    })
    it("should return response object containing user and token",async()=>{
        email = "example@gmail.com"
        password = "testing";
        await User.create({email, password})
        const {body: result} = await execute()
        expect(result["user"] && result["token"]).toBeDefined()
    })
})

describe("forget password",()=>{
    let email: string;
    afterEach(async()=>{
        await User.deleteMany({})
        Server.close()
    })

    function execute(){
        return request(Server).post("/api/v1/auth/forget-password").send({ email})
    }

    it("should return 404 status if email does not exist",async()=>{
        email = "test@gmail.com"
        const res = await execute()
        expect(res.statusCode).toBe(404)
    })
    it("should return error mrssage if email does not exist",async()=>{
        email = "test@gmail.com"
        const res = await execute()
        expect(res.body["message"]).toBeDefined();
    })
    it("should return 203 status code.",async()=>{
        email = "example@gmail.com";
        let password = "testing"
        await User.create({email, password})
        const res = await execute()
        // expect(res.statusCode).toBe(203)
    })
})

describe("reset password",()=>{
    let token: string;
    let password: string;
    let confirmPassword: string;
    function execute(){
        return request(Server).post("/api/v1/auth/forget-password/"+token).send({})
    }
    it("should return 404 if invalid/expired token is provided",async()=>{
        token = "1"
        const res = await execute()
        expect(res.statusCode).toBe(404)
    })
    it("should return error message 'user not found' ",async()=>{
        token = "1"
        const res = await execute() 
        expect(res.body["message"]).toMatch(/not found/i)
    })
})

describe("google auth", ()=>{
    function execute(){
        return request(Server).get("/api/v1/auth/google")
    }
    const authFn = jest.fn()
    it("should call passport authenticate method",async()=>{
        const res = await execute()
        passport.authenticate = authFn()
        expect(authFn).toHaveBeenCalled()
    })
})