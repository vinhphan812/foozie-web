const express = require("express");

const { homePage } = require("../controllers/index.controller");
const AuthRoute = require("./auth.route");
const UserRoute = require("./user.route");

const router = express.Router();

router.use(AuthRoute);
router.use("/user", UserRoute);

router.get("/", homePage);

module.exports = router;
