import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import "express-async-errors";
import useRouters from "./startup/routes";
import passport from "passport";
import Session from "express-session";
import mongo from "connect-mongo";
import listEndPoints from "express-list-endpoints";
import * as multer from "./middlewares/media"
import { destroyImage, uploadImage, uploadImages } from "./services/media";
import listEndpoints from "express-list-endpoints";

dotenv.config()

const app: Application = express()
const port = Number(process.env.PORT)!

app.use(cors())
app.use(helmet())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(Session({
    secret: process.env.SECRET!,
    store: mongo.create({mongoUrl: process.env.DB_URI!}),
    resave: true,
    saveUninitialized: false
}))
app.use(passport.session())
app.use(passport.initialize());

useRouters(app)

async function start(){
    try{
    app.listen(port, ()=>console.log(`server running ${process.env.NODE_ENV} mode on port ${port}`))
    await mongoose.connect(process.env.DB_URI!)
    console.log("connected to db")
    }catch(ex){
        console.log("error starting the server", ex)
        process.exit(1)
    }
}

start()