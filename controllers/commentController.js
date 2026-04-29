const ArticleModel = require("../models/articleModel");
const CommentModel = require("../models/commentModel");
const asyncHandler = require("../utils/asyncHandler");

exports.index = asyncHandler(async (req, res) => {
  const status = req.query.status || "";
  const comments = await CommentModel.getAll({ status });

  res.render("comments/index", {
    title: "Comment Management",
    comments,
    filters: {
      status,
    },
  });
});

exports.create = asyncHandler(async (req, res) => {
  const article = await ArticleModel.getById(req.params.articleId);

  if (!article) {
    res.status(404);
    return res.render("errors/404", { title: "Article Not Found" });
  }

  const authorName = (req.body.authorName || "").trim();
  const authorEmail = (req.body.authorEmail || "").trim();
  const content = (req.body.content || "").trim();

  if (!authorName || !content) {
    return res.redirect(`/articles/${article.id}`);
  }

  await CommentModel.create({
    articleId: article.id,
    authorName,
    authorEmail,
    content,
  });

  res.redirect(`/articles/${article.id}#comments`);
});

exports.destroy = asyncHandler(async (req, res) => {
  await CommentModel.delete(req.params.id);
  res.redirect("/comments");
});
