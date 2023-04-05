import express, { Application } from "express";
import "express-async-errors";
import { createServer} from "http";
import useSocket from "./services/chat";
import dotenv from "dotenv";
import mongoose from "mongoose";
import useRouters from "./startup/routes";
import { connectRedisClient } from "./services/cache";
import useMiddlewares from "./startup/middlewares";

dotenv.config()

const app: Application = express()
const Server = createServer(app)
const port = Number(process.env.PORT)!

useMiddlewares(app)
connectRedisClient()
useSocket(Server)
useRouters(app)

async function start(){
    try{
    Server.listen(port, ()=>console.log(`server running ${process.env.NODE_ENV} mode on port ${port}`))
    await mongoose.connect(process.env.DB_URI!)
    console.log("connected to db")
    }catch(ex){
        console.log("error starting the server", ex)
        process.exit(1)
    }
}

start()