module.exports = {
	errorMiddleware: (req, res, next) => {
		res.render("errors/404");
	},
};
