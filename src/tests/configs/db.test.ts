import connectDB from "../../config/db";
import mongoose from "mongoose";

describe("db", ()=>{
    const connectFn = jest.fn();
    mongoose.connect = connectFn
    it("should call connect function", async()=>{
        await connectDB()
        expect(connectFn).toHaveBeenCalled();
    })
})