const { User, Branch } = require("../../models/index");
const { ROLE } = require("../../utils/role.enum");

module.exports = {
	managerBranches: async (req, res, next) => {
		res.locals.scripts = ["/public/js/deleteBranch.js"];
		res.locals.seo.title = "Quản Lý Chi Nhánh";
		res.locals.branches = await Branch.find({
			is_delete: false,
		}).populate("manager");
		return res.render("admin/branches/index");
	},
	editBranch: async (req, res, next) => {
		const { id } = req.params;
		const branch = await Branch.findOne({ _id: id });

		const managers = await User.find({ role: ROLE.MANAGER });

		if (!branch) return next();

		res.locals.managers = managers;
		res.locals.body = branch;
		res.locals.seo.title = "Chỉnh sửa " + branch.name;

		res.render("admin/branches/branch");
	},
	createBranchPage: async (req, res, next) => {
		res.locals.seo.title = "Tạo Chi Nhánh";

		const managers = await User.find({ role: ROLE.MANAGER });

		res.locals.isCreate = true;
		res.locals.managers = managers;

		res.render("admin/branches/branch");
	},
	createBranchHandle: async (req, res, next) => {
		res.locals.seo.title = "Tạo Chi Nhánh";
		const { body, errors } = res.locals;

		res.locals.managers = await User.find({ role: ROLE.MANAGER });

		if (errors.length) return res.render("admin/branches/branch");

		await Branch.create(body);

		res.redirect("/admin/branches/");
	},
	updateBranch: async (req, res, next) => {
		const { body, errors } = res.locals;
		const { id } = req.params;

		if (errors.length) return res.render("admin/branches/branch");

		await Branch.update({ _id: id }, { $set: body });

		res.redirect("/admin/branches/");
	},
};
