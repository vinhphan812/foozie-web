const { callErrorFromStatus } = require("@grpc/grpc-js/build/src/call");
const User = require("../models/user.model");

module.exports = {
	signUpValidate: async (req, res, next) => {
		const {
			username,
			password,
			first_name,
			last_name,
			email,
			phone,
			passwordConfirm,
			gender,
		} = req.body;

		const errors = [];

		if (
			!username ||
			!password ||
			!first_name ||
			!last_name ||
			!email ||
			!phone ||
			!passwordConfirm ||
			!gender
		) {
			errors.push("Vui lòng điền đầy đủ thông tin...!");
		}

		if (password != passwordConfirm) {
			errors.push("Mật khẩu xác nhận không đúng");
		}

		const emailRegistedCheck = await User.findOne({ email });
		const phoneRegistedCheck = await User.findOne({ phone });
		const userRegistedCheck = await User.findOne({ username });

		if (emailRegistedCheck) errors.push("Email đã được đang ký...!");
		if (phoneRegistedCheck)
			errors.push("Số điện thoại đã được đăng ký...!");
		if (userRegistedCheck)
			errors.push("Tên đăng nhập đã được đăng ký...!");

		res.locals.errors = errors;

		res.locals.body = {
			username,
			password,
			first_name,
			last_name,
			email,
			phone,
			passwordConfirm,
		};

		next();
	},
	forgotValidate: async (req, res, next) => {
		const { email } = req.body;

		let isExist = false;

		if (await User.find({ email })) isExist = true;

		if (isExist) next();
		else return res.json({ sucess: false, message: "EMAIL_NOT_EXIST" });
	},
};
