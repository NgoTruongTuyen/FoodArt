import express from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
  getSeason,
  postSeason,
  deleteSeason,
  putSeason,
} from "../components/dishes/seasonController";
const router = express.Router();

router.get("/:slug/:name", requireAdmin, getSeason);

router.post("/", requireAdmin, postSeason);

router.delete("/:slug/:seasonSlug", requireAdmin, deleteSeason);

router.put("/:slug", requireAdmin, putSeason);

// router.get("/createAllSeason", requireAdmin, async (req, res, next) => {
//   try {
//     // find dishes that has no season
//     const dishes = await Dish.find({ seasons: { $size: 0 } });

//     // create season for each dish
//     for (let i = 0; i < dishes.length; i++) {
//       const { _id, name } = dishes[i];

//       const season = new Season({ name: "Season 1", dish: _id });

//       await season.save();
//     }

//     res.status(200).json({ success: true });
//   } catch (err) {
//     next(err);
//   }
// });

export default router;
