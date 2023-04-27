import { connectRedisClient, setCache, getCache, getOrSetCache } from "../../services/cache";

describe("connect redis client",()=>{
    it("should connect to redis server successfully",()=>{
        expect(()=>connectRedisClient()).not.toThrow()
    })
})

describe("set cache",() =>{
        const fn = ()=>setCache('test', 1)
    it("should not throw error",async()=>{
        expect(fn).not.toThrow();
    })
    it("should not throw error",async()=>{
        const res = await fn()
        expect(res).toBe("OK");
    })
})

describe("get cache",() =>{
    beforeAll(async()=>{
        await setCache("test", 1)
    })
    const fn = ()=>getCache('test')
    it("should not throw error",async()=>{
        expect(fn).not.toThrow();
    })
    it("should not throw error",async()=>{
        const res = await fn()
        expect(res).toBe(1);
    })
})

describe("get or set cache", ()=>{
    function func(){
        return 10
    }
    it("should get data stored if it already exists",async()=>{
        await setCache("test01", 1)
        const res = await getOrSetCache("test01", func);
        expect(res).toBe(1);
    });
    it("should set data if it does not exist",async()=>{
        const res = await getOrSetCache("test02", func);
        expect(res).toBe(10);
    })
})