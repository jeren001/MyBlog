const express = require("express");

const articleController = require("../controllers/articleController");

const router = express.Router();

router.get("/", articleController.index);
router.get("/new", articleController.newForm);
router.post("/", articleController.create);
router.get("/:id", articleController.show);
router.get("/:id/edit", articleController.editForm);
router.put("/:id", articleController.update);
router.delete("/:id", articleController.destroy);

module.exports = router;
