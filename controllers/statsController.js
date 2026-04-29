const StatsModel = require("../models/statsModel");
const asyncHandler = require("../utils/asyncHandler");

exports.index = asyncHandler(async (req, res) => {
  const [overview, topPages] = await Promise.all([
    StatsModel.getOverview(),
    StatsModel.getTopPages(20),
  ]);

  res.render("stats/index", {
    title: "Page Statistics",
    overview,
    topPages,
  });
});
