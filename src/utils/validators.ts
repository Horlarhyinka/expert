import Joi from "joi";
import { mailRegex } from "./regex";

export const validateCredentials = (credentials: Object) => Joi.object({
    email: Joi.string().required().pattern(mailRegex).min(6),
    password: Joi.string().required().min(6)
}).validate(credentials)