const { User } = require("../models");

module.exports = {
	userDetails: async (req, res, next) => {
		const { user } = res.locals;
		res.locals.seo.title = "Hồ Sơ Của Tôi";
		res.render("users/details");
	},
};
