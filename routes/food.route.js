const { Router } = require("express");

const { detailFood } = require("../controllers/food.controller");
const IdValidation = require("../validations/id.validation");

const router = Router();

router.get("/:idProduct", detailFood);
module.exports = router;
