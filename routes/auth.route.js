const { Router } = require("express");

const {
	loginHandle,
	forgotHandle,
	signUpHandle,
	logoutHandle,
	registerPage,
	loginPage,
} = require("../controllers/auth.controller");
const {
	signUpValidate,
	forgotValidate,
} = require("../validations/auth.validation");

const router = Router();

router.route("/sign_up").get(registerPage).post(signUpValidate, signUpHandle);

router.route("/sign_in").get(loginPage).post(loginHandle);

router.post("/forgot", forgotValidate, forgotHandle);

router.get("/logout", logoutHandle);

module.exports = router;
