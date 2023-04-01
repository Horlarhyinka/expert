import Joi from "joi";
import { mailRegex, secureUrlRegex } from "./regex";
import {Types} from "mongoose";

export const validateCredentials = (credentials: Object) => Joi.object({
    email: Joi.string().required().pattern(mailRegex).min(6),
    password: Joi.string().required().min(6)
}).validate(credentials)

export const validateCollection = (collectionBody: Object) =>Joi.object({
    title: Joi.string().required(),
    about: Joi.string().max(200),
    skills: Joi.array(),
    portfolio: Joi.string().regex(secureUrlRegex),
    album: Joi.array(),
    views: Joi.number().default(0).min(0)
}).validate(collectionBody)

export const validateObjectId = (id: string)=>Types.ObjectId.isValid(id)