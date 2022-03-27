import mongoose from "mongoose";
import Episode from "./episodeModel";
import Dish from "./dishModel";

const seasonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // max length 20
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    episodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Episode",
      },
    ],
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

seasonSchema.index({ name: 1, dish: 1 }, { unique: true });

seasonSchema.virtual("slug").get(function () {
  return this.name.replace(/\s+/g, "-").toLowerCase();
});

seasonSchema.pre("remove", async function (next) {
  //remove from dish
  const dish = await Dish.findById(this.dish);
  dish.seasons = dish.seasons.filter(
    (season) => season.toString() !== this._id.toString()
  );
  await dish.save();
});

seasonSchema.pre("remove", async function (next) {
  try {
    await Episode.deleteMany({ season: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

//oncreate
seasonSchema.post("save", async function (season, next) {
  try {
    const dish = await Dish.findById(season.dish);

    // check if season is already in dish
    if (dish.seasons.indexOf(season._id) === -1) {
      dish.seasons.push(season._id);
      await dish.save();
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Season = mongoose.model("season", seasonSchema);

export default Season;
