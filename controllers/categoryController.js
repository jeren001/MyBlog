const CategoryModel = require("../models/categoryModel");
const asyncHandler = require("../utils/asyncHandler");

exports.index = asyncHandler(async (req, res) => {
  const categories = await CategoryModel.getAll();

  res.render("categories/index", {
    title: "Category Management",
    categories,
    errorMessage: null,
    formValues: {
      name: "",
      description: "",
    },
  });
});

exports.show = asyncHandler(async (req, res) => {
  const payload = await CategoryModel.getWithArticles(req.params.id);

  if (!payload) {
    res.status(404);
    return res.render("errors/404", { title: "Category Not Found" });
  }

  res.render("categories/show", {
    title: payload.category.name,
    category: payload.category,
    articles: payload.articles,
  });
});

exports.create = asyncHandler(async (req, res) => {
  const name = (req.body.name || "").trim();
  const description = (req.body.description || "").trim();

  if (!name) {
    const categories = await CategoryModel.getAll();

    res.status(400);
    return res.render("categories/index", {
      title: "Category Management",
      categories,
      errorMessage: "Category name is required.",
      formValues: {
        name,
        description,
      },
    });
  }

  await CategoryModel.create({ name, description });
  res.redirect("/categories");
});
