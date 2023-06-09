import {RequestHandler, Router} from "express";
import passport from "passport";
import { usePassport } from "../config/oauth";
const router: Router = Router();
import * as auth from "../controllers/auth"

router.post("/register", auth.register)
router.post("/login", auth.login)
router.patch("/forget-password/:token", auth.resetPassword)
router.post("/forget-password", auth.forgetPassword)
router.get("/google", usePassport())
router.get("/redirect", passport.authenticate("google"), auth.googleOauthCallback)

export default router;