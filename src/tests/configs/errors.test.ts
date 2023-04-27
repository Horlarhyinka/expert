import errors from "../../config/errors";

describe("config/errors",()=>{
    const exitFn = jest.fn()
    process.exit = exitFn()
    it("should call process.exit method",async()=>{
        const func = () =>{
            return Promise.reject("testing")
        }
        try{
            await func()
        }catch(ex){
            errors()
            expect(exitFn).toHaveBeenCalled()
        }
    })
})