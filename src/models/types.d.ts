import { Document, Model } from "mongoose";

export interface user_int extends Document{
    email: string,
    password: string,
    firstName: string | undefined,
    lastName: string | undefined,
    about: string | undefined,
    collections: (null | collection_int)[],
    tel: number,
    resetToken: string | undefined,
    tokenExpiresIn: Date | undefined,
    verifyPassword: (password: string) => Promise<boolean>,
    genToken: ()=> string
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