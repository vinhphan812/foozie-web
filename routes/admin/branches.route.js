const { Router } = require("express");

const {
	managerBranches,
	createBranchPage,
	createBranchHandle,
	editBranch,
} = require("../../controllers/admin/branches.controller");
const idValidation = require("../../validations/id.validation");

const router = new Router();

router.get("/", managerBranches);

router.route("/create").get(createBranchPage).post(createBranchHandle);

router.get("/:id", idValidation, editBranch);

module.exports = router;
