import mongoose from "mongoose";
import Category from "./categoryModel";

const dishSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  englishTitle: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    // enum type: complete, in-progress, dropped
    type: String,
    required: true,
    enum: ["complete", "in-progress", "dropped"],
    default: "in-progress",
  },
  time: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: null,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

// set pre save for dishSchema
dishSchema.pre("save", async function (next) {
  // update category

  // console.log("categories", this.categories);
  if (this.categories) {
    this.categories.forEach(async (category) => {
      // add dish to category if not exist
      const cat = await Category.findById(category);

      if (!cat.dishes.includes(this._id)) {
        cat.dishes.push(this._id);
        cat.save();
      }

      // console.log(cat);
    });
  }
  next();
});

// delete from category if dish is deleted
dishSchema.pre("remove", function (next) {
  // update category
  if (this.categories) {
    this.categories.forEach((category) => {
      // remove dish from category
      category.dishes.pull(this._id);
    });
  }
  next();
});

const Dish = mongoose.model("Dish", dishSchema);

export default Dish;
