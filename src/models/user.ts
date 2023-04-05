import { Schema, model, Model} from 'mongoose';
import { user_int, collection_int, user_model } from './types';
import { mailRegex, telRegex } from '../utils/regex';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userMethods from './user.methods';
import Collection from "./collection";
import { Request } from 'express';

dotenv.config()

const userSchema = new Schema<user_int>({
    email: {
        type: String,
        required: true,
        match: mailRegex
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    about: {
        type: String
    },
    avatar:{
        type: String
    },
    tel: {
        type: Number,
        match: telRegex
    },
    collections: {
        type: [Schema.Types.ObjectId],
        ref: "collection"
    },
    resetToken: {
        type: String,
    },
    tokenExpiresIn: {
        type: Date
    }
})

userSchema.pre("save", async function(){
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
})

userSchema.statics.findDuplicate = async function (email: string) {
    return this.findOne({email})
}

userMethods(userSchema);

export default model<user_int, user_model>("user", userSchema);