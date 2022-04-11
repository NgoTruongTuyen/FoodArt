import { getNewDishes } from "./dishesService";
import User from "../auth/userModel";

export const getHomePage = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  // fetch dishes
  const reviewMoi = getNewDishes({ page, limit });

  // fetch phim hanh dong
  const monNhatBan = getNewDishes({
    page,
    limit,
    categorySlugs: ["nhat-ban"],
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
    monNhatBanData,
    onlineUsersData,
  ] = await Promise.all([
    reviewMoi,
    monTrungQuoc,
    monVietnam,
    monNhatBan,
    onlineUsers,
  ]);

  res.render("index", {
    title: "Trang chủ",
    data: {
      reviewMoi: reviewMoiData,
      monTrungQuoc: monTrungQuocData,
      monVietnam: monVietnamData,
      monNhatBan: monNhatBanData,
    },
    onlineUsers: onlineUsersData,
  });
};
