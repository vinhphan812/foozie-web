const { Food } = require("../models/index");

module.exports = {
	home: async (req, res, next) => {
		res.locals.seo.title = "Trang Chủ";
		res.locals.seo.description = "";
		res.locals.seo.keywords = [
			"Foozie Home",
			"Foozie Foods",
			"Food Delivery",
		];

		console.log(await Food.find().limit(10));

		res.render("home/index");
	},
};
