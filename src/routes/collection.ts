import { Router } from "express";
import * as collections from "../controllers/collection";
import authMiddleware from "../middlewares/auth";
const router = Router();

router.get("/all", collections.getAllcollections)
router.use(authMiddleware)
router.post("/", collections.createCollection);
router.get("/", collections.getCollections);
router.delete("/:id", collections.removeCollection);
export default router;