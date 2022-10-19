const md5 = require("md5");
const User = require("../../models/user.model");

module.exports = {
	loginHandle: async (req, res, next) => {
		const { user, pass } = req.body;
		let success = false;

		const userData = await User.findOne({
			$or: [{ username: user }, { email: user }, { phone: user }],
			password: md5(pass),
		});

		if (!userData) success = false;
		else {
			success = true;
			res.cookie("userId", userData.id, { signed: true });
		}

		res.json({
			success,
			message: success
				? "SUCCESS_AUTHENTICATION"
				: "FAIL_AUTHENTICATION",
		});
	},

	forgotHandle: (req, res, next) => {
		const { email } = req.body;

		//! send mail

		res.json({ success: true, message: "SEND_MAIL_SUCCESS" });
	},

	signUpHandle: async (req, res, next) => {
		const { user } = res.locals;
		const { token } = req.body;

		user.password = md5(user.password);

		const userCreated = await User.create(user);

		res.json({
			success: true,
			message: "CREATE_ACCOUNT_SUCCESS",
		});
	},

	logoutHandle: (req, res, next) => {
		res.clearCookie("userId").json({
			success: true,
			message: "LOGOUT_SUCCESS",
		});
	},
};
