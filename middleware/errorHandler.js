const appConfig = require("../config/app");

module.exports = function errorHandler(error, req, res, next) {
  console.error(error);

  res.status(error.statusCode || 500).render("errors/500", {
    title: "Server Error",
    error: appConfig.env === "development" ? error : null,
  });
};
