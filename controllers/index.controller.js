const { Food } = require("../models/index");

module.exports = {
	homePage: async (req, res, next) => {
		res.locals.seo.title = "Trang Chủ";
		res.locals.seo.description = "";
		res.locals.seo.keywords = [
			"Foozie",
			"Foozie Home",
			"Foozie Foods",
			"Food Delivery",
		];

		res.render("home/index");
		res.end();
	},
};
