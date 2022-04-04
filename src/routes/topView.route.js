import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("dishes/views/topluotxem", { title: "Top lượt xem" });
});

export default router;
