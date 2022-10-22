const { User, Branch } = require("../../models/index");
const { ROLE } = require("../../utils/role.enum");

module.exports = {
	managerBranches: (req, res, next) => {
		res.locals.seo.title = "Quản Lý Chi Nhánh";
		return res.render("admin/branches/index");
	},
	editBranch: async (req, res, next) => {
		const { id } = req.params;
		const branch = await Branch.findOne({ _id: id });

		if (!branch) return next();

		res.locals.branch = branch;
		res.locals.seo.title = "Chỉnh sửa " + branch.name;

		res.render("admin/branches/edit");
	},
	createBranchPage: async (req, res, next) => {
		res.locals.seo.title = "Tạo Chi Nhánh";

		const managers = await User.find({ role: ROLE.MANAGER });

		res.locals.managers = managers;

		res.render("admin/branches/create");
	},
	createBranchHandle: async (req, res, next) => {},
};
