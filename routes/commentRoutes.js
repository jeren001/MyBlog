const express = require("express");

const commentController = require("../controllers/commentController");

const router = express.Router();

router.get("/comments", commentController.index);
router.post("/articles/:articleId/comments", commentController.create);
router.delete("/comments/:id", commentController.destroy);

module.exports = router;
