const ArticleModel = require("../models/articleModel");
const CategoryModel = require("../models/categoryModel");
const StatsModel = require("../models/statsModel");
const asyncHandler = require("../utils/asyncHandler");

exports.index = asyncHandler(async (req, res) => {
  const [latestArticles, categories, overview, topPages] = await Promise.all([
    ArticleModel.getLatest(5),
    CategoryModel.getAll(),
    StatsModel.getOverview(),
    StatsModel.getTopPages(5),
  ]);

  const title = "Jeren's Blog";
  res.locals.title = title;

  res.render("home/index", {
    title,
    latestArticles,
    categories,
    overview,
    topPages,
  });
});
