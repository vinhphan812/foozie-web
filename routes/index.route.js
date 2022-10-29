const { Router } = require("express");

const { homePage, searchPage } = require("../controllers/index.controller");
const AuthRoute = require("./auth.route");
const UserRoute = require("./user.route");
const FoodRoute = require("./food.route");

const router = Router();

router.use(AuthRoute);
router.use("/user", UserRoute);
router.use("/foods", FoodRoute);
router.get("/search", searchPage);
router.get("/", homePage);

module.exports = router;
