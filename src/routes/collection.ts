import { Router, Request, Response } from "express";
import * as collections from "../controllers/collection";
import authMiddleware from "../middlewares/auth";
import useIdParam from "../middlewares/validateId";
import { uploadOne, uploadMany } from "../middlewares/media";

const router = Router();

router.get("/all", collections.getAllCollections)
router.get("/", collections.getCollections);
router.get("/:id", useIdParam, collections.getCollection)
router.use(authMiddleware)
router.post("/", collections.createCollection);
router.delete("/:id", useIdParam, collections.removeCollection);
router.put("/:id", useIdParam, collections.updateUserCollection);
router.post("/:id/avatar", useIdParam, uploadOne, collections.updateCollectionAvatar);
router.put("/:id/album", useIdParam, uploadMany, collections.addToAlbum);
router.delete("/:id/album", useIdParam, collections.removeFromAlbum);
export default router;