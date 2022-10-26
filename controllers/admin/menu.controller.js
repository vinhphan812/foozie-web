const { Food } = require("../../models/index");

module.exports = {
	index: async (req, res, next) => {
		res.locals.seo.title = "Menu";
		const foods = await Food.getAll();
		res.locals.foods = foods;
		res.render("admin/menu/index");
	},
};
