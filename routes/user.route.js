const express = require("express");
const {
	decentralization,
} = require("../api/middlewares/decentralization.middleware");
const { upload } = require("../configs/uploadFile");

const { userDetails } = require("../controllers/user.controller");

const router = express.Router();

router.use(decentralization("CUSTOMER"));

router.get("/profile", userDetails);

router.get("/upload-avatar", upload.single("avatar"));

module.exports = router;
