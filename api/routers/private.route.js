const express = require("express");

const userRoute = require("./user.route");
const adminRoute = require("./admin.route");
const managerRoute = require("./manager.route");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// authentication middleware
router.use(authMiddleware);
router.use("/user", userRoute);
router.use("/admin", adminRoute);
router.use("/manager", managerRoute);

module.exports = router;
