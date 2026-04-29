const express = require("express");

const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.get("/", categoryController.index);
router.post("/", categoryController.create);
router.get("/:id", categoryController.show);

module.exports = router;
