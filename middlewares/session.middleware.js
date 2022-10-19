const { Store } = require("../models/index");

module.exports = {
	sessionMiddleware: async (req, res, next) => {
		if (!req.signedCookies.sessionId) {
			const store = await Store.createCart();
			res.cookie("sessionId", store.id, { signed: true });
		}
		next();
	},
};
