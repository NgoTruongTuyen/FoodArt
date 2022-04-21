import { getNewDishes } from "./dishesService";
import User from "../auth/userModel";

export const getHomePage = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  // fetch dishes
  const reviewMoi = getNewDishes({ page, limit });

  // fetch phim hanh dong
  const anCaTheGioi = getNewDishes({
    page,
    limit,
    categorySlugs: ["an-ca-the-gioi"],
  });

  // fetch phim hoat hinh
  const monTrungQuoc = getNewDishes({
    page,
    limit,
    categorySlugs: ["trung-quoc"],
  });

  // fetch phim kinh di
  const monVietnam = getNewDishes({
    page,
    limit,
    categorySlugs: ["viet-nam"],
  });

  // find all user that user.isOnline equal true
  const onlineUsers = User.find({}).then((users) => {
    return users.filter((user) => user.isOnline());
  });

  // await all promises
  const [
    reviewMoiData,
    monTrungQuocData,
    monVietnamData,
    anCaTheGioiData,
    onlineUsersData,
  ] = await Promise.all([
    reviewMoi,
    monTrungQuoc,
    monVietnam,
    anCaTheGioi,
    onlineUsers,
  ]);

  res.render("index", {
    title: "Trang chủ",
    data: {
      reviewMoi: reviewMoiData,
      monTrungQuoc: monTrungQuocData,
      monVietnam: monVietnamData,
      anCaTheGioi: anCaTheGioiData,
    },
    onlineUsers: onlineUsersData,
  });
};
