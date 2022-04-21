import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";

import { 
  addCategory, 
  getCategories, 
  pagingCategories,
  deleteCategory
} from "../components/dishes/categoryController";

const router = Router();

router.post("*", requireAdmin);

router.post("/", addCategory);

router.get("/", getCategories);

router.get("/:slug", pagingCategories);

router.delete("/:slug", requireAdmin, deleteCategory);
export default router;
