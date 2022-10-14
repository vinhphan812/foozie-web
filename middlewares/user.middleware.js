const User = require("../models/user.model");

module.exports = async (req, res, next) => {
	const { userId } = req.signedCookies;

	if (!userId) next();

	const user = await User.get(userId);

	res.locals.user = user;
	res.locals.userId = userId;

	next();
};
