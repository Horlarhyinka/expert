import express, { Application } from "express";
import { createServer} from "http";
import useSocket from "./services/chat";
import dotenv from "dotenv";
import connectDB from "./config/db";
import useRouters from "./startup/routes";
import { connectRedisClient } from "./services/cache";
import useMiddlewares from "./startup/middlewares";

import "express-async-errors";
import handleErrors from "./config/errors";
handleErrors()

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
    await connectDB()
    console.log("connected to db")
    }catch(ex){
        console.log("error starting the server", ex)
        process.exit(1)
    }
}

start()