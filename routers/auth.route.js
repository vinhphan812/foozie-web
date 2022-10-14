const express = require("express");

const {
	loginHandle,
	forgotHandle,
	signUpHandle,
	logoutHandle,
	loginAdmin,
	registerPage,
	loginPage,
} = require("../controllers/auth.controller");
const {
	signUpValidate,
	forgotValidate,
} = require("../api/validations/auth.vailidate");

const router = express.Router();

router.route("/sign_up").get(registerPage).post(signUpHandle);

router.route("/sign_in").get(loginPage).post(loginHandle);

router.post("/forgot", forgotValidate, forgotHandle);

router.get("/logout", logoutHandle);

module.exports = router;
