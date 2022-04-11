import Dish from "./dishModel";
import User from "../auth/userModel";
import Category from "./categoryModel";
import Comment from "./commentModel";

import createError from "http-errors";
import {
  getNewDishes,
  getDishWithTheSameCategory,
  increaseViewCount,
  getRandomMovies,
} from "./dishesService";

// Routing
export const getMovies = async (req, res, next) => {
  // page
  const page = parseInt(req.query.page) || 1;
  // limit
  const limit = req.query.limit || 10;
  // by name
  const matchName = req.query.matchName || "";
  // by category
  const categorySlugs = req.query.categorySlugs || [];

  try {
    const dishes = await getNewDishes({
      page: page,
      limit,
      matchName,
      categorySlugs,
    });

    //set nextPage as link to next page as current domain
    res.json({
      success: true,
      data: dishes,
      page: page,
      length: dishes.length,
      nextPage: `${req.protocol}://${req.get("host")}/api/dishes?page=${
        page + 1
      }&limit=${limit}&matchName=${matchName}`,
    });
  } catch (error) {
    next(createError(error));
  }
};

export const getTopMovies = async (req, res, next) => {
  // page
  const page = req.query.page || 1;
  // limit
  const limit = req.query.limit || 10;

  try {
    const dishes = await getNewDishes({
      page,
      limit,
      sortByDate: false,
      sortByViews: true,
    });

    //set nextPage as link to next page as current domain
    res.json({
      success: true,
      data: dishes,
      length: dishes.length,
      nextPage: `${req.protocol}://${req.get("host")}/dishes?page=${
        page + 1
      }&limit=${limit}`,
    });
  } catch (error) {
    next(createError(error));
  }
};

export const getSingleMovie = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const success = req.session?.success;

    const dish = await Dish.findOne({ slug }).populate({
      path: "categories",
      model: Category,
    });

    if (!dish) {
      throw new Error("Dish not found");
    }

    let isFavorite = false;
    if (res.locals.user) {
      const user = await User.findById(res.locals.user.id);
      isFavorite = user.favorites.some(
        (movieId) => movieId.toString() === dish._id.toString()
      );
    }

    // Increase view count
    increaseViewCount(dish._id);

    // get comments
    // const comments = Comment.find({ dish: dish._id }).populate({
    //   path: "user",
    //   model: User,
    // });

    // pagination for comments
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(5);
    const start = (page - 1) * limit;
    const comments = Comment.find({ dish: dish._id })
      .skip(start)
      .limit(limit)
      .populate({
        path: "user",
        model: User,
      })
      .sort({ createdAt: -1 });
    const commentCount = await Comment.countDocuments({ dish: dish._id });
    // total pages
    const totalPages = Math.ceil(commentCount / limit);
    const pagination = Array.from({ length: totalPages }, (_, i) => i + 1).map(
      (page) => {
        return {
          url: `/dishes/${dish.slug}?page=${page}`,
          number: page,
        };
      }
    );
    // new dishes
    const newSingleMovies = getDishWithTheSameCategory({
      dish,
      page: 1,
      limit: 10,
    });
    const randomMovies = getRandomMovies({ limit: 10 });

    const [commentsResolved, randomMoviesResolved, newSingleMoviesResolved] =
      await Promise.all([comments, randomMovies, newSingleMovies]);

    res.render("dishes/views/dishes/single-dish", {
      title: dish.title,
      dish,
      newSingleMovies: newSingleMoviesResolved,
      randomMovies: randomMoviesResolved,
      isFavorite,
      comments: commentsResolved,
      success,
      pagination,
      currentIndex: page - 1,
      currentPage: page,
    });
  } catch (err) {
    console.log(err);
    next(createError(404, err.message));
  }
};

export const getEpisode = async (req, res, next) => {
  try {
    const { slug, season, episode } = req.params;

    const dish = await Dish.findOne({ slug });

    if (!dish) {
      throw new Error("Dish not found");
    }

    const episodeData = seasonData.episodes.find((e) => e.slug === episode);

    if (!episodeData) {
      throw new Error("Episode not found");
    }

    const vimeoId = episodeData.serverVimeo.split("/")[3];

    const video = "https://player.vimeo.com/video/" + vimeoId;

    res.render("dishes/views/dishes/episode", {
      title: dish.title + " - " + seasonData.name + " - " + episodeData.title,
      dish,
      season: seasonData,
      episode: episodeData,
      video,
    });
  } catch (err) {
    next(createError(404, err.message));
  }
};

export const postMovie = async (req, res) => {
  // console.log(req.body);

  try {
    const {
      title,
      image,
      time,
      trailer,
      premiere,
      description,
      releaseYear,
      rating,
      imdbId,
      slug,
      categories,
      englishTitle,
    } = req.body;

    // create dish with mongoose
    const newMovie = await Dish.create({
      title,
      englishTitle,
      image,
      time,
      trailer,
      premiere,
      description,
      releaseYear,
      rating,
      imdbId,
      slug,
      categories,
    });

    // console.log(newMovie);
    // res.json({ success: true, data: newCat });

    req.flash("success", `${title} - ${englishTitle} has been added`);

    res.redirect("/admin/dishes");
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const {
      title,
      image,
      time,
      trailer,
      premiere,
      description,
      releaseYear,
      rating,
      imdbId,
      slug,
      categories,
    } = req.body;

    const { id } = req.params;

    const updatedMovie = await Dish.findByIdAndUpdate(
      id,
      {
        title,
        image,
        time,
        trailer,
        premiere,
        description,
        releaseYear,
        rating,
        imdbId,
        slug,
        categories,
      },
      { new: true }
    );

    res.json({ success: true, data: updatedMovie });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getMovieByCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const dishes = await Dish.find({ categories: slug }).populate({
      path: "categories",
      model: Category,
    });

    res.json({ success: true, data: dishes });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const editMovie = async (req, res) => {
  try {
    // check if method put
    if (req.body._method !== "PUT") {
      return;
    }
    const { slug } = req.params;
    // Get Data from body
    const {
      description,
      title,
      image,
      time,
      trailer,
      premiere,
      releaseYear,
      rating,
      imdbId,
      englishTitle,
    } = req.body;

    let query = {
      description,
      title,
      image,
      time,
      trailer,
      premiere,
      releaseYear,
      rating,
      imdbId,
      englishTitle,
    };

    // edit dish in db
    await Dish.findOneAndUpdate({ slug }, query, {
      new: true,
    });

    res.redirect("/dishes/" + slug);
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/admin/dishes/");
  }
};

export const deleteMovie = async (req, res) => {
  try {
    if (req.body._method !== "DELETE") {
      return;
    }
    const { slug } = req.params;
    const dish = await Dish.findOne({ slug });

    await Dish.findByIdAndDelete(dish._id);

    res.redirect("/admin/dishes");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/admin/dishes");
  }
};
