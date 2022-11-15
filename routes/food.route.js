const { Router } = require("express");

const { detailFood, commentFood } = require("../controllers/food.controller");
const IdValidation = require("../validations/id.validation");
const { createCommentValidation } = require("../validations/create.validation");

const router = Router();

router.get("/:id", IdValidation, detailFood);
router.post("/:id/comment", IdValidation, createCommentValidation, commentFood);

module.exports = router;
