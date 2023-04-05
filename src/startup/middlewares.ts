import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import Session from "express-session";
import mongo from "connect-mongo";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config()

declare module "express-session"{
    interface SessionData{
        count: number
    }
}

export default (app: express.Application) =>{
    app.use(cors())
    app.use(helmet())
    app.use(express.urlencoded({extended: true}))
    app.use(express.json());
    app.use(cookieParser(process.env.SECRET))
    app.use(Session({
        secret: process.env.SECRET!,
        store: mongo.create({mongoUrl: process.env.DB_URI!}),
        resave:  false,
        saveUninitialized: false,
    }))
    app.use(passport.session())
    app.use(passport.initialize());
}