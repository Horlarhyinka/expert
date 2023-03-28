import { Schema, model, Model} from 'mongoose';
import { user_int, collection_int, user_model } from './types';
import { mailRegex, telRegex } from '../utils/regex';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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

userSchema.methods.verifyPassword = function(password: string){
    if(!password)return false;
    return bcrypt.compare(password, this.password)
}

userSchema.methods.updateProfile = async function(update: Request["body"]):Promise<user_int>{
    const mutables = ["firstName", "lastName", "about", "tel"]
    Object.keys(update).forEach((key) =>{
        if(mutables.includes(key)){
            this.set(key, update[key]!)
        }
    })
    return await this.save()
}

userSchema.methods.addCollection = async function(infos: {title: string, about?: string, skills?: (string | null)[], portfolio?: string}){
    const collection = await Collection.create({...infos});
    const newCollections = [...(this as user_int).collections, collection._id]
    this.set("collections", newCollections)
    await this.save();
    return collection;
}

userSchema.methods.getCollections = async function(){
    await (this as user_int).populate("collections");
    return (this as user_int).collections
}

userSchema.methods.removeCollection = async function(id: string){
    if(!(this as user_int).collections?.includes(id)){
        return false
    }
    await Collection.findByIdAndRemove(id)
    await this.populate("collections");
    return this.collections
}

userSchema.methods.genToken = function(){
    return jwt.sign({id: (this as user_int)._id}, process.env.SECRET!, {expiresIn: "2d"})
}

export default model<user_int, user_model>("user", userSchema);