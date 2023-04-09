import { Router } from "express";
import { getExperts, getExpert } from "../controllers/user";
import useIdParam from "../middlewares/validateId";

const router = Router()

router.get("/", getExperts)
router.get("/:id", useIdParam, getExpert)

export default router