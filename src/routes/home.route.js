import { Router } from "express";
import { getHomePage } from "../components/dishes/homeController";

const router = Router();

router.get("/", getHomePage);

export default router;
