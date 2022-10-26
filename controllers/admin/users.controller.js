const { User } = require("../../models/index");
const { ROLE } = require("../../utils/role.enum");
const md5 = require("md5");

module.exports = {
	managerUsers: async (req, res, next) => {
		res.locals.seo.title = "Quản Lý Người Dùng";
		res.locals.scripts = ["/public/js/deleteUser.js"];

		const users = await User.find({ is_delete: false });

		res.locals.users = users;

		res.render("admin/users/index");
	},
	createUserPage: async (req, res, next) => {
		res.locals.seo.title = "Tạo Người Dùng";
		res.locals.role = Object.values(ROLE);
		res.locals.isCreate = true;

		res.render("admin/users/user");
	},
	createUserHandle: async (req, res, next) => {
		res.locals.seo.title = "Tạo Người Dùng";
		res.locals.role = Object.values(ROLE);
		res.locals.isCreate = true;

		const { body } = res.locals;

		if (res.locals.errors.length) {
			return res.render("admin/users/user");
		}

		body.password = md5(body.password);

		const data = await User.create(body);

		res.redirect("/admin/users");
	},
	editUser: async (req, res, next) => {
		const { id } = req.params;
		res.locals.isCreate = false;
		const user = await User.findOne({ _id: id });

		if (!user) return next();
		res.locals.role = Object.values(ROLE);

		res.locals.seo.title = `Chỉnh sửa ${user.last_name} ${user.first_name}`;

		res.locals.body = user;
		res.render("admin/users/user");
	},
	updateUser: async (req, res, next) => {
		const { password, ...body } = res.locals.body;
		const { id } = req.params;

		await User.updateOne({ _id: id }, { $set: body });

		res.redirect("/admin/users");
	},
};
