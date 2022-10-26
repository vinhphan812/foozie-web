const { Router } = require("express");

const {
	managerBranches,
	createBranchPage,
	createBranchHandle,
	editBranch,
	updateBranch,
} = require("../../controllers/admin/branches.controller");

const {
	createBranchValidation,
} = require("../../validations/create.validation");
const idValidation = require("../../validations/id.validation");

const router = new Router();

router.get("/", managerBranches);

router
	.route("/create")
	.get(createBranchPage)
	.post(createBranchValidation, createBranchHandle);

router
	.route("/:id/update")
	.all(idValidation)
	.get(editBranch)
	.post(createBranchValidation, updateBranch);

module.exports = router;
