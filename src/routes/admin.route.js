import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
  getAdmin,
  getAdminPanel,
  getUserPanel,
  moviePanelEditMovie,
  moviePanelGetIndex,
  moviePanelGetMovie,
  moviePanelPostMovie,
  getCategoriesPanel,
  moviePanelEditSeason,
  createAdmin,
  makeAdmin,
  banUser,
  infoUser,
  makeUser,
} from "../components/admin/adminController";

const router = Router();

// use authMiddleware to check if user is logged in
router.use(requireAdmin);

router.get("/", getAdmin);

router.get("/admins", getAdminPanel);

router.get("/users", getUserPanel);

router.get("/dishes/", moviePanelGetIndex);

router.get("/dishes/:slug", moviePanelGetMovie);

router.get("/dishes/:slug/edit", moviePanelEditMovie);

// router.get("/dishes/:slug/season/:seasonSlug", moviePanelEditSeason);

router.post("/dishes/:slug", moviePanelPostMovie);

router.get("/categories", getCategoriesPanel);

router.post("/createAdmin", createAdmin);

router.post("/admins/makeAdmin", makeAdmin);

router.post("/admins/ban", banUser);

router.get("/users/:username", infoUser);

router.post("/admins/makeUser", makeUser);
export default router;
