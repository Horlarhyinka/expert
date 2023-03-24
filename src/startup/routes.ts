import { Application } from "express";
import authRouter from "../routes/auth"

export default (app: Application)=>{
    app.use("/api/v1/auth", authRouter)
}