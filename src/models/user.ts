import { Schema, model } from 'mongoose';
import { user_int, user_model } from './types';
import { mailRegex, telRegex } from '../utils/regex';
import dotenv from "dotenv";
import userMethods from './user.methods';

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

userMethods(userSchema)

export default model<user_int, user_model>("user", userSchema);