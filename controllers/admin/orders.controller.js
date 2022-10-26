const {} = require("../../models/index");

module.exports = {
	index: async (req, res, next) => {
		res.locals.seo.title = "Đơn Hàng";
		res.render("admin/orders/index");
	},
};
