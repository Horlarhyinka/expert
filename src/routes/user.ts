import {Router} from "express";
import * as user from "../controllers/user";
import authMiddleware from "../middlewares/auth"

const router = Router();

router.use(authMiddleware)
router.put("/profile", user.updateProfile);

export default router;