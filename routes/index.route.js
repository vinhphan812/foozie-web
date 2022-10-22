const { Router } = require("express");

const { homePage } = require("../controllers/index.controller");
const AuthRoute = require("./auth.route");
const UserRoute = require("./user.route");
const FoodRoute = require("./food.route");
const AdminRoute = require("./admin/index.route");

const router = Router();

router.use(AuthRoute);
router.use("/admin", AdminRoute);
router.use("/user", UserRoute);
router.use("/foods", FoodRoute);

router.get("/", homePage);

module.exports = router;
