import Season from "./seasonModel";
import Episode from "./episodeModel";
import Dish from "./dishModel";

export const getSeason = async (req, res, next) => {
    try {
      const { slug, name } = req.params;
  
      const dish = await Dish.findOne({ slug }).populate({
        path: "seasons",
        model: Season,
      });
  
      if (!dish) {
        throw new Error("Dish not found");
      }
  
      const season = dish.seasons.find((s) => s.name === name);
  
      // const season = await Season.findOne({ slug, name }).populate({
      //   path: "episodes",
      //   model: Episode,
      // });
  
      if (!season) throw new Error("Season not found");
  
      res.status(200).json(season);
    } catch (error) {
      next(createError(404, error.message));
    }
};

export const postSeason = async (req, res, next) => {
    try {
      const { name, dish } = req.body;
  
      const season = new Season({ name, dish });
  
      await season.save();
  
      const { slug } = await Dish.findOne({ _id: dish });
  
      // res.status(201).json({ success: true, season });
  
      res.redirect(`/admin/dishes/${slug}/edit`);
    } catch (err) {
      next(err);
    }
};

export const deleteSeason = async (req, res, next) => {
    try {
      const { slug, seasonSlug } = req.params;
  
      const dish = await Dish.findOne({ slug }).populate({
        path: "seasons",
        model: Season,
      });
  
      const season = dish.seasons.find((s) => s.slug === seasonSlug);
  
      if (!season) throw new Error("Season not found");
  
      await season.remove();
  
      if (!season) {
        throw new Error("Season not found");
      }
  
      res.status(200).json({ success: true, season });
    } catch (err) {
      next(err);
    }
};

export const putSeason = async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { name } = req.body;
  
      const season = await Season.findOneAndUpdate(
        { slug },
        { name },
        { new: true }
      );
  
      if (!season) {
        throw new Error("Season not found");
      }
  
      res.status(200).json(season);
    } catch (err) {
      next(err);
    }
};