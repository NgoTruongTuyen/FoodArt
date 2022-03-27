import Dish from "./dishModel";
import Season from "./seasonModel";
import Episode from "./episodeModel";
import Category from "./categoryModel";

// Mongoose interaction
export const getNewMovies = async ({
  page = 1,
  limit = 10,
  categorySlugs = [],
  sortByDate = true,
  sortByViews = false,
  lean = false,
  matchName = "",
}) => {
  page = parseInt(page);

  // set querystring for category
  let query = {};

  // get categories Id base on category slugs
  if (categorySlugs.length > 0) {
    const categories = await Category.find({ slug: { $in: categorySlugs } });
    const categoryIds = categories.map((category) => category._id);

    query = {
      categories: { $in: categoryIds },
    };
  }

  // set querystring for name
  if (matchName) {
    query = {
      ...query,
      // title and englishTitle
      $or: [
        { title: { $regex: matchName, $options: "i" } },
        { englishTitle: { $regex: matchName, $options: "i" } },
      ],
    };
  }

  const skip = parseInt(limit * (page - 1));

  // populate if needed
  const dishes = await Dish.find(query)
    .sort({
      // createdAt: sortByDate ? -1 : 1,
      _id: sortByDate ? -1 : 1,
      viewCount: sortByViews ? -1 : 1,
    })
    .skip(skip)
    .limit(limit)
    .lean(lean);

  return dishes;
};

export const getMovieWithOneEpisode = async ({ page = 1, limit = 10 }) => {
  page = parseInt(page);
  limit = parseInt(limit);

  // select dishes with one season, season with one episode
  const dishes = await Dish.find({ seasons: { $size: 1 } })
    .skip((page - 1) * limit)
    .sort({ _id: -1 })
    .populate({
      path: "seasons",
      model: Season,
      populate: {
        path: "episodes",
        model: Episode,
      },
    });

  return dishes
    .filter((dish) => dish.seasons[0].episodes.length === 1)
    .slice(0, limit);
};

export const increaseViewCount = async (movieId) => {
  const dish = await Dish.findById(movieId);

  if (!dish) {
    throw createError(404, "Dish not found");
  }

  dish.viewCount += 1;
  await dish.save();
};

// get random 10 dishes
export const getRandomMovies = async ({ limit = 10 }) => {

  const dishes = await Dish.find({}).lean(true);
  // shuffle array
  const shuffledMovies = dishes.sort(() => 0.5 - Math.random());

  return shuffledMovies.slice(0, limit);
};