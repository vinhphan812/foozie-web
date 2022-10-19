const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/uploads/users");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

module.exports = { upload: multer({ storage }) };
