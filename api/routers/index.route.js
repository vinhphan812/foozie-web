const express = require("express");

const userRoute = require("./user.route");
const publicRoute = require("./public.route");
const adminRoute = require("./admin.route");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// public route
router.use("/", publicRoute);

// authentication middleware
router.use(authMiddleware);
router.use("/user", userRoute);
router.use("/admin", adminRoute);

router.get("/", function (req, res, next) {
	res.json({ success: true, message: "route api of Foozie" });
});

router.use(function (req, res, next) {
	res.status(404).json({ success: false, message: "API_NOT_FOUND" });
});

module.exports = router;
