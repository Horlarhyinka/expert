import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export default () =>{
const url = process.env.DB_URI!
return mongoose.connect(url)
}