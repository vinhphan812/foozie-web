const { Router } = require("express");
const { getFoodByType } = require("../controllers/public.controller");

const IdValidation = require("../validations/id.validation");

const router = Router();

router.get("/food-type/:typeId", getFoodByType);
module.exports = router;
