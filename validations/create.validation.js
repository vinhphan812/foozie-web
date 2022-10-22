const { User } = require("../models/index");

module.exports = {
	createUserValidation: async (req, res, next) => {
		const {
			username,
			last_name,
			first_name,
			email,
			phone,
			role,
			gender,
		} = req.body;

		const errors = [];

		if (
			!username ||
			!last_name ||
			!first_name ||
			!email ||
			!phone ||
			!role ||
			!gender
		)
			errors.push("Vui lòng điền đầy đủ thông tin...!");

		if (!["male", "female"].includes(gender))
			errors.push("Giới tính không đúng...!");

		if (phone.length != 10)
			errors.push("Định dạng số điện thoại không đúng...!");

		const usernameExisted = await User.findOne({ username });
		const emailExisted = await User.findOne({ email });
		const phoneExisted = await User.findOne({ phone });

		if (usernameExisted) errors.push("Tên đăng nhập đã được đăng ký...!");
		if (emailExisted) errors.push("Email đã được đăng ký...!");
		if (phoneExisted) errors.push("Số điện thoại đã được đăng ký...!");

		res.locals.errors = errors;

		res.locals.body = {
			username,
			last_name,
			first_name,
			email,
			phone,
			role,
			gender,
			password: "12345678",
		};

		next();
	},
	createBranch: async (req, res, next) => {},
};
