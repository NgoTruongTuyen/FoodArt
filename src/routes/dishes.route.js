import { Router } from "express";
import Dish from "../components/dishes/dishModel";
import Category from "../components/dishes/categoryModel";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
  postMovie,
  getSingleMovie,
  getMovies,
  getTopMovies,
  getSeason,
  getEpisode,
  editMovie,
  deleteMovie,
} from "../components/dishes/moviesController";

const router = Router();

router.post("/", requireAdmin, postMovie);

router.get("/", getMovies);
router.get("/ranking", getTopMovies);
router.get("/:slug/season/", getSeason);
router.get("/:slug/:season/:episode/", getEpisode);
router.get("/:slug", getSingleMovie);
router.post("/:slug/edit", requireAdmin, editMovie);
router.post("/:slug/delete", requireAdmin, deleteMovie);
export default router;
