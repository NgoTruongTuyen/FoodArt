import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  dishes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Dish",
  },
});

// Remove category from dish reference to
categorySchema.pre("remove", async function (next) {
  try {
    await this.model("Dish").updateMany(
      { categories: this._id },
      { $pull: { categories: this._id } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model("category", categorySchema);

export default Category;
