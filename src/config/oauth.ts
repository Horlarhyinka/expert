import { Request } from "express";
import passport from "passport";
import User from "../models/user";
import {Profile, Strategy, VerifyCallback} from "passport-google-oauth20";
import { user_int } from "../models/types";
import dotenv from "dotenv";
dotenv.config()

passport.use(new Strategy({
 clientID: process.env.GOOGLE_CLIENT_ID!,
 clientSecret:  process.env.GOOGLE_CLIENT_SECRET!,
 callbackURL: process.env.BASE_URL! + "/auth/redirect",
 passReqToCallback: true
},async(req: Request, accessToken: string, refreshToken, profile: Profile, done: VerifyCallback) =>{

    const { email } = profile._json
    const password = profile.id
    let user = await User.findOne({email})
    if(user){
        const verifiedPassword = await user.verifyPassword(password)
        if(!verifiedPassword)return done("incorrect password", undefined)
        return done(null, user)
    }else{
        user = await User.create({email, password})
        done(null, user)
    }
}))

passport.serializeUser((user , done: VerifyCallback)=>{
    const {_id: id} = user as user_int;
    if(!id)return done("user not found", undefined)
    return done(null, id)
})

passport.deserializeUser(async(id, done: VerifyCallback)=>{
    const user: user_int | null = await User.findById(id)
    if(!user)return done("not found", undefined)
    return done(null, user!)
})

export const usePassport = () => passport.authenticate("google",{scope: ["profile", "email"]})