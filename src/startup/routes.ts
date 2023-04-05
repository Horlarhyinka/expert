import { Application } from "express";
import authRouter from "../routes/auth";
import userRouter from "../routes/user";
import collectionRouter from "../routes/collection";
import notFound from "../routes/not-found";
import expertRouter from "../routes/expert";
import chatRouter from "../routes/chat";

export default (app: Application)=>{
    app.use("/api/v1/auth", authRouter)
    app.use("/api/v1/user", userRouter)
    app.use("/api/v1/collections",collectionRouter)
    app.use("/api/v1/experts", expertRouter)
    app.use("/api/v1/chat", chatRouter)
    app.use(notFound)
}