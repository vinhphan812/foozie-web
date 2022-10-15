const { APP_NAME } = process.env;
const Branch = require("../models/branch.model");

module.exports = {
	seoConfigMiddleware: async (req, res, next) => {
		// role display UI
		res.locals.listNotDisplaySignNav = ["/sign_in", "/sign_up"];

		// init seo config object saving to locals response storage
		res.locals.seo = {
			title: "",
			description: "",
			keywords: [],
			search: "",
			url: "https://" + req.hostname + req.url,
			image: "",
		};

		res.locals.branchs = await Branch.find();
		// saving path for check
		res.locals.path = req.url;
		// saving APP_NAME
		res.locals.APP_NAME = APP_NAME;
		console.log(
			req.url,
			res.locals.listNotDisplaySignNav.includes(req.url)
		);

		next();
	},
};
