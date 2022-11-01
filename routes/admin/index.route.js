const { Router } = require("express");

const {
	decentralization,
} = require("../../api/middlewares/decentralization.middleware");
const { ROLE } = require("../../utils/role.enum");
const BranchesRoute = require("./branches.route");
const UsersRoute = require("./users.route");
const MenuRoute = require("./menu.route");
const OrdersRoute = require("./orders.route");
const { index } = require("../../controllers/admin/index.controller");

const router = new Router();

router.use(decentralization(ROLE.ADMIN));

router.use("/branches", BranchesRoute);

router.use("/users", UsersRoute);

router.use("/menu", MenuRoute);

router.use("/orders", OrdersRoute);

router.get("/", index);

module.exports = router;
