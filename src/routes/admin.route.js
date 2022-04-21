import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
  getAdmin,
  getAdminPanel,
  getUserPanel,
  dishPanelEditDish,
  dishPanelGetIndex,
  dishPanelGetDish,
  dishPanelPostDish,
  getCategoriesPanel,
  dishPanelEditSeason,
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

router.get("/dishes/", dishPanelGetIndex);

router.get("/dishes/:slug", dishPanelGetDish);

router.get("/dishes/:slug/edit", dishPanelEditDish);

// router.get("/dishes/:slug/season/:seasonSlug", dishPanelEditSeason);

router.post("/dishes/:slug", dishPanelPostDish);

router.get("/categories", getCategoriesPanel);

router.post("/createAdmin", createAdmin);

router.post("/admins/makeAdmin", makeAdmin);

router.post("/admins/ban", banUser);

router.get("/users/:username", infoUser);

router.post("/admins/makeUser", makeUser);
export default router;
