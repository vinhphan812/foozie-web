const { Router } = require("express");

const {
     homePage,
     searchPage,
     vouchers,
} = require("../controllers/index.controller");
const AuthRoute = require("./auth.route"),
     UserRoute = require("./user.route"),
     FoodRoute = require("./food.route"),
     AdminRoute = require("./admin/index.route"),
     OrderRoute = require("./order.route");

const router = Router();

router.use(AuthRoute);
router.use("/admin", AdminRoute);
router.use("/user", UserRoute);
router.use("/foods", FoodRoute);
router.use("/order", OrderRoute);
router.get("/search", searchPage);
router.get("/", homePage);
router.get("/vouchers", vouchers);

module.exports = router;
