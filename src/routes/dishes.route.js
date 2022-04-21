import { Router } from "express";
import Dish from "../components/dishes/dishModel";
import Category from "../components/dishes/categoryModel";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
  postDish,
  getSingleDish,
  getDishs,
  getTopDishs,
  getSeason,
  getEpisode,
  editDish,
  deleteDish,
} from "../components/dishes/dishesController";

const router = Router();

router.post("/", requireAdmin, postDish);

router.get("/", getDishs);
router.get("/ranking", getTopDishs);
// router.get("/:slug/season/", getSeason);
// router.get("/:slug/:season/:episode/", getEpisode);
router.get("/:slug", getSingleDish);
router.post("/:slug/edit", requireAdmin, editDish);
router.post("/:slug/delete", requireAdmin, deleteDish);
export default router;
