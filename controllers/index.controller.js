const { Food } = require("../models/index");

module.exports = {
	homePage: async (req, res, next) => {
		res.locals.seo.title = "Trang Chủ";
		res.locals.seo.description = "";
		res.locals.seo.keywords = [
			"Foozie Home",
			"Foozie Foods",
			"Food Delivery",
		];

		console.log(await Food.find().limit(5));

		res.render("home/index");
		res.end();
	},
};
