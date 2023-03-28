import { Application } from "express";
import authRouter from "../routes/auth";
import userRouter from "../routes/user";
import collectionRouter from "../routes/collection";

export default (app: Application)=>{
    app.use("/api/v1/auth", authRouter)
    app.use("/api/v1/user", userRouter)
    app.use("/api/v1/collections",collectionRouter)
}