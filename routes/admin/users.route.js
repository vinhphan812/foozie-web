const { Router } = require("express");

const idValidation = require("../../validations/id.validation");
const { createUserValidation } = require("../../validations/create.validation");
const {
	managerUsers,
	createUserPage,
	createUserHandle,
	editUser,
	updateUser,
} = require("../../controllers/admin/users.controller");

const router = new Router();

router.get("/", managerUsers);

router
	.route("/create")
	.get(createUserPage)
	.post(createUserValidation, createUserHandle);

router
	.route("/:id/update")
	.all(idValidation)
	.get(editUser)
	.post(createUserValidation, updateUser);

module.exports = router;
