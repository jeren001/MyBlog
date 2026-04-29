const express = require("express");
const methodOverride = require("method-override");
const path = require("path");

const appConfig = require("./config/app");
const pageStats = require("./middleware/pageStats");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const indexRoutes = require("./routes/indexRoutes");
const articleRoutes = require("./routes/articleRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const commentRoutes = require("./routes/commentRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/prototype", express.static(path.join(__dirname, "prototype")));

app.use((req, res, next) => {
  res.locals.siteName = appConfig.siteName;
  res.locals.currentPath = req.path;
  res.locals.year = new Date().getFullYear();
  res.locals.pageStyles = [];
  res.locals.pageScripts = [];
  next();
});

app.use(pageStats);

app.use("/", indexRoutes);
app.use("/articles", articleRoutes);
app.use("/categories", categoryRoutes);
app.use("/", commentRoutes);
app.use("/stats", statsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
