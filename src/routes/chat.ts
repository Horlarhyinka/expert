import { Router } from "express";
import * as chats from "../controllers/chat";
import auth from "../middlewares/auth";
const router = Router()

router.get("/", auth, chats.getChats)
router.get("/:id", auth, chats.getRoomChat)

export default router