const { Router } = require("express");

const {
	index,
	editPage,
	updateFood,
	createPage,
	createFoodHandler,
} = require("../../controllers/admin/menu.controller");

const { createFoodValidation } = require("../../validations/create.validation");

const idValidation = require("../../validations/id.validation");

const router = new Router();

router.get("/", index);

router
	.route("/create")
	.get(createPage)
	.post(createFoodValidation, createFoodHandler);

router
	.route("/:id/update")
	.all(idValidation)
	.get(editPage)
	.post(createFoodValidation, updateFood);

module.exports = router;
