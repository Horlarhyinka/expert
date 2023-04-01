import {Router} from "express";
import * as user from "../controllers/user";
import authMiddleware from "../middlewares/auth";
import { uploadOne } from "../middlewares/media";

const router = Router();

router.use(authMiddleware)
router.put("/profile", user.updateProfile);
router.put("/avatar", uploadOne, user.updateUserAvatar);
export default router;