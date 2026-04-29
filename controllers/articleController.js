const Article = require("../models/article");
const ArticleModel = require("../models/articleModel");
const CategoryModel = require("../models/categoryModel");
const CommentModel = require("../models/commentModel");
const asyncHandler = require("../utils/asyncHandler");

function buildArticlePayload(body) {
  return {
    title: (body.title || "").trim(),
    excerpt: (body.excerpt || "").trim(),
    content: (body.content || "").trim(),
    categoryId: body.categoryId || "",
    tags: (body.tags || "").trim(),
    readingTime: body.readingTime || 5,
    publishedAt: body.publishedAt || "",
  };
}

function buildApiArticlePayload(body = {}) {
  const payload = {};

  if (body.title !== undefined) {
    payload.title = String(body.title).trim();
  }

  if (body.content !== undefined) {
    payload.content = String(body.content).trim();
  }

  if (body.category_id !== undefined || body.categoryId !== undefined) {
    payload.category_id = body.category_id ?? body.categoryId;
  }

  if (body.tags !== undefined) {
    payload.tags = body.tags;
  }

  return payload;
}

function generateSummary(content = "") {
  return String(content).replace(/\s+/g, " ").trim().slice(0, 150);
}

function getFormDefaults(article = {}) {
  return {
    title: article.title || "",
    excerpt: article.excerpt || "",
    content: article.content || "",
    categoryId: article.categoryId || article.category_id || "",
    tags: article.tags || "",
    readingTime: article.readingTime || article.reading_time || 5,
    publishedAt:
      article.publishedAt ||
      (article.published_at
        ? new Date(article.published_at).toISOString().slice(0, 16)
        : ""),
  };
}

exports.getArticles = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const categoryId = req.query.categoryId ?? req.query.category_id ?? "";
  const tag = req.query.tag || "";

  const result = await Article.findAll({
    page,
    limit,
    categoryId,
    tag,
  });

  res.status(200).json({
    data: result.data,
    pagination: result.pagination,
    filters: {
      category_id: categoryId || null,
      tag: tag || null,
    },
  });
});

exports.getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({
      message: "Article not found.",
    });
  }

  res.status(200).json({
    data: article,
  });
});

exports.createArticle = asyncHandler(async (req, res) => {
  const payload = buildApiArticlePayload(req.body);

  if (!payload.title || !payload.content) {
    return res.status(400).json({
      message: "Title and content are required.",
    });
  }

  payload.summary = generateSummary(payload.content);

  const article = await Article.create(payload);

  res.status(201).json({
    message: "Article created successfully.",
    data: article,
  });
});

exports.updateArticle = asyncHandler(async (req, res) => {
  const existingArticle = await Article.findById(req.params.id);

  if (!existingArticle) {
    return res.status(404).json({
      message: "Article not found.",
    });
  }

  const payload = buildApiArticlePayload(req.body);
  const nextTitle =
    payload.title !== undefined ? payload.title : existingArticle.title;
  const nextContent =
    payload.content !== undefined ? payload.content : existingArticle.content;

  if (!nextTitle || !nextContent) {
    return res.status(400).json({
      message: "Title and content are required.",
    });
  }

  payload.title = nextTitle;
  payload.content = nextContent;

  if (payload.content !== existingArticle.content) {
    payload.summary = generateSummary(payload.content);
  } else {
    payload.summary = existingArticle.summary;
  }

  const article = await Article.update(req.params.id, payload);

  res.status(200).json({
    message: "Article updated successfully.",
    data: article,
  });
});

exports.deleteArticle = asyncHandler(async (req, res) => {
  const deleted = await Article.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      message: "Article not found.",
    });
  }

  res.status(200).json({
    message: "Article deleted successfully.",
  });
});

exports.index = asyncHandler(async (req, res) => {
  const filters = {
    search: req.query.search || "",
    categoryId: req.query.categoryId || "",
  };

  const [articles, categories] = await Promise.all([
    ArticleModel.getAll(filters),
    CategoryModel.getAll(),
  ]);

  res.render("articles/index", {
    title: "Article Management",
    articles,
    categories,
    filters,
  });
});

exports.show = asyncHandler(async (req, res) => {
  const article = await ArticleModel.getById(req.params.id);

  if (!article) {
    res.status(404);
    return res.render("errors/404", { title: "Article Not Found" });
  }

  const [comments, relatedArticles] = await Promise.all([
    CommentModel.getApprovedByArticleId(article.id),
    ArticleModel.getRelated(article.id, article.category_id, 3),
  ]);

  res.render("articles/show", {
    title: article.title,
    article,
    comments,
    relatedArticles,
  });
});

exports.newForm = asyncHandler(async (req, res) => {
  const categories = await CategoryModel.getAll();

  res.render("articles/form", {
    title: "Create Article",
    formTitle: "Create Article",
    formAction: "/articles",
    formMethod: "POST",
    submitLabel: "Create Article",
    categories,
    article: getFormDefaults(),
    errorMessage: null,
  });
});

exports.create = asyncHandler(async (req, res) => {
  const payload = buildArticlePayload(req.body);
  const categories = await CategoryModel.getAll();

  if (!payload.title || !payload.content) {
    res.status(400);
    return res.render("articles/form", {
      title: "Create Article",
      formTitle: "Create Article",
      formAction: "/articles",
      formMethod: "POST",
      submitLabel: "Create Article",
      categories,
      article: getFormDefaults(payload),
      errorMessage: "Title and content are required.",
    });
  }

  const article = await ArticleModel.create(payload);
  res.redirect(`/articles/${article.id}`);
});

exports.editForm = asyncHandler(async (req, res) => {
  const [article, categories] = await Promise.all([
    ArticleModel.getById(req.params.id),
    CategoryModel.getAll(),
  ]);

  if (!article) {
    res.status(404);
    return res.render("errors/404", { title: "Article Not Found" });
  }

  res.render("articles/form", {
    title: `Edit ${article.title}`,
    formTitle: "Edit Article",
    formAction: `/articles/${article.id}?_method=PUT`,
    formMethod: "POST",
    submitLabel: "Update Article",
    categories,
    article: getFormDefaults(article),
    errorMessage: null,
  });
});

exports.update = asyncHandler(async (req, res) => {
  const existingArticle = await ArticleModel.getById(req.params.id);

  if (!existingArticle) {
    res.status(404);
    return res.render("errors/404", { title: "Article Not Found" });
  }

  const payload = buildArticlePayload(req.body);
  const categories = await CategoryModel.getAll();

  if (!payload.title || !payload.content) {
    res.status(400);
    return res.render("articles/form", {
      title: `Edit ${existingArticle.title}`,
      formTitle: "Edit Article",
      formAction: `/articles/${existingArticle.id}?_method=PUT`,
      formMethod: "POST",
      submitLabel: "Update Article",
      categories,
      article: getFormDefaults({
        ...existingArticle,
        ...payload,
        category_id: payload.categoryId,
        reading_time: payload.readingTime,
        published_at: payload.publishedAt,
      }),
      errorMessage: "Title and content are required.",
    });
  }

  const article = await ArticleModel.update(req.params.id, payload);
  res.redirect(`/articles/${article.id}`);
});

exports.destroy = asyncHandler(async (req, res) => {
  await ArticleModel.delete(req.params.id);
  res.redirect("/articles");
});
