import { createClient } from "@redis/client";

const config = process.env.NODE_ENV !== "production"? {} : {
    host: "",
    port: "",
    url: ""
}

const client = createClient(config)
client.connect().then(res =>{
    console.log("redis client connected" + res)
}).catch(ex => console.log("failed to connect to redis server" + ex))

export const setCache = async(key: string, data: unknown): Promise<string | null> =>{
    try{
     return client.set(key, JSON.stringify(data))
    }catch(ex){
        console.log(ex)
        return null;
    }
    }

export const getCache = async(key: string): Promise<string | null> =>{
    try{
    const raw = await client.get(key);
    if(!raw)return null
    return JSON.parse(raw)
    }catch(ex){
        console.log(ex)
        return null
    }
}

export const getOrSetCache = async(key: string, fn: Function): Promise<unknown> =>{
    try{
    const existed = await client.get(key);
    if(existed){
        return JSON.parse(existed)
    }
    const callBackData = await fn()
    if(!callBackData)return null;
    await client.set(key, JSON.stringify(callBackData))
    return callBackData;
    }catch(ex){
        return fn()
    }
}