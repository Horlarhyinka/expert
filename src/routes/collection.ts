import { Router, Request, Response } from "express";
import * as collections from "../controllers/collection";
import authMiddleware from "../middlewares/auth";
import useIdParam from "../middlewares/validateId";
import { uploadOne, uploadMany } from "../middlewares/media";

const router = Router();

router.get("/all", collections.getAllCollections)
router.get("/", collections.getCollections);
router.get("/:id", useIdParam, collections.getCollection);
//authenticated routes
router.post("/", authMiddleware, collections.createCollection);
router.delete("/:id", authMiddleware, useIdParam, collections.removeCollection);
router.put("/:id",authMiddleware , useIdParam, collections.updateUserCollection);
router.post("/:id/avatar",authMiddleware ,useIdParam, uploadOne, collections.updateCollectionAvatar);
router.put("/:id/album",authMiddleware ,useIdParam, uploadMany, collections.addToAlbum);
router.delete("/:id/album",authMiddleware ,useIdParam, collections.removeFromAlbum);
export default router;