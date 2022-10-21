module.exports = (req, res, next) => {
	const { id } = req.params;
	if (id.length != 24) res.render("errors/404");
	next();
};
