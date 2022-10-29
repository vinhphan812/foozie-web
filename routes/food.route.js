const { Router } = require("express");

const { detailFood, searchFood } = require("../controllers/food.controller");
const IdValidation = require("../validations/id.validation");

const router = Router();

router.get("/:id", IdValidation, detailFood);
module.exports = router;
