const md5 = require("md5");
const User = require("../models/user.model");
// const NotificationFactory = require("../../modules/notification");

module.exports = {
	loginPage: (req, res, next) => {
		res.render("users/sign_in");
	},
	registerPage: (req, res, next) => {
		res.render("users/sign_up");
	},
	loginHandle: async (req, res, next) => {
		const { user, pass } = req.body;
		const errors = [];
		res.locals.login = { user, pass };

		const userData = await User.findOne({
			$or: [{ username: user }, { email: user }, { phone: user }],
			password: md5(pass),
		});

		if (!userData) {
			errors.push("Tài khoản, mật khẩu bạn vừa nhập chưa đúng");
			res.render("users/sign_in", { errors });
		} else {
			res.cookie("userId", userData.id, { signed: true });
			res.redirect("/");
		}
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

		await NotificationFactory.createNotify(
			{
				title: `Chúc mừng bạn đã tạo thành công!`,
				body: `${user.username} đã được tạo thành công! đăng nhập app để thỏa sức đặt đồ ăn!`,
			},
			token,
			userCreated.id,
			`user/${userCreated.id}`
		);
		res.json({
			success: true,
			message: "CREATE_ACCOUNT_SUCCESS",
		});
	},

	logoutHandle: (req, res, next) => {
		res.clearCookie("userId").redirect("/");
	},
};
