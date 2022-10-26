const { Router } = require("express");
const { ROLE } = require("../../utils/role.enum");
const {
	decentralizationAPI,
} = require("../middlewares/decentralization.middleware");
const idValidate = require("../validations/id.validate");
const { deleteUser, deleteBranch } = require("../controllers/admin.controller");

const router = new Router();

router.use(decentralizationAPI(ROLE.ADMIN));

router.route("/users/:id").all(idValidate).delete(deleteUser);
router.route("/branches/:id").all(idValidate).delete(deleteBranch);

module.exports = router;
