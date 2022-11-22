const express = require("express");

const publicRoute = require("./public.route");
const privateRoute = require("./private.route");
const authRoute = require("./auth.route");

const router = express.Router();

// public route
router.use("/", publicRoute);
router.use("/auth", authRoute);

// private route

router.use(privateRoute);

router.get("/", function (req, res, next) {
     res.json({ success: true, message: "route api of Foozie" });
});

router.use(function (req, res, next) {
     res.status(404).json({ success: false, message: "API_NOT_FOUND" });
});

module.exports = router;
