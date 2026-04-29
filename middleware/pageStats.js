const StatsModel = require("../models/statsModel");

function shouldTrackRequest(req) {
  if (req.method !== "GET") {
    return false;
  }

  return !/\.(css|js|png|jpg|jpeg|svg|gif|ico|webp)$/i.test(req.path);
}

module.exports = function pageStats(req, res, next) {
  if (!shouldTrackRequest(req)) {
    return next();
  }

  res.on("finish", () => {
    if (res.statusCode < 200 || res.statusCode >= 400) {
      return;
    }

    StatsModel.trackPageView({
      path: req.originalUrl.split("?")[0],
      title: res.locals.title || req.path,
    }).catch((error) => {
      console.error("Failed to record page statistics.");
      console.error(error.message);
    });
  });

  next();
};
