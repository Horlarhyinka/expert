import {Router} from "express";
import * as user from "../controllers/user";
import authMiddleware from "../middlewares/auth";
import { uploadOne } from "../middlewares/media";

const router = Router();

//authenticated routes below
router.put("/profile",authMiddleware , user.updateProfile);
router.put("/avatar",authMiddleware ,uploadOne, user.updateUserAvatar);
export default router;