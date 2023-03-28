import { Request } from "express";
import mongoose, { Document, Model } from "mongoose";

export interface user_int extends Document{
    email: string,
    password: string,
    firstName: string | undefined,
    lastName: string | undefined,
    about: string | undefined,
    collections: (null | collection_int | mongoose.Types.ObjectId | string)[],
    tel: number,
    resetToken: string | undefined,
    tokenExpiresIn: Date | undefined,
    verifyPassword: (password: string) => Promise<boolean>,
    genToken: ()=> string,
    updateProfile: (update : Request["body"]) =>Promise<void | user_int>,
    addCollection: (infos: object) =>Promise<collection_int | null>,
    getCollections: () => Promise<(collection_int | null)[]>,
    removeCollection: (id: string) => Promise<boolean | (collection_int | null)[] >
}

export interface collection_int extends Document{
    title: string,
    about: string | undefined,
    skills: (string | null)[],
    portfolio: string | undefined,
    album: (string | null)[],
    views: number
}

export interface user_model extends Model<user_int>{
    findDuplicate: (email: string) => Promise<user_int | null>
}