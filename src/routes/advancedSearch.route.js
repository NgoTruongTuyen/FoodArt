import { Router } from "express";
import Category from "../components/dishes/categoryModel";

const router = Router();

router.get("/", async (req, res) => {
  // get categories
  const categories = await Category.find({}).lean();

  res.render("dishes/views/tim-kiem-nang-cao", {
    title: "Tìm kiếm nâng cao",
    categories,
  });
});

export default router;
