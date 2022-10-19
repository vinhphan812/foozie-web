const User = require("../../models/user.model");

const lvlPerms = { ADMIN: 3, manager: 2, CUSTOMER: 1 };

module.exports = {
	decentralization: (perms) => {
		return async (req, res, next) => {
			// if (req.method == "GET") return next();

			const userId = req.signedCookies.userId;
			let userPerms = "CUSTOMER";

			if (userId)
				userPerms = (
					await User.findOne({
						_id: userId,
					})
				).role;
			else return res.redirect("/sign_in");

			if (lvlPerms[userPerms] < lvlPerms[perms])
				return res.status(403).render("error/permission");

			next();
		};
	},
};
