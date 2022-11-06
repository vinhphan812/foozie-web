const { Router } = require("express");
const { route } = require("../auth.route");
const { index } = require("../../controllers/admin/chat.controller");
const router = new Router();

router.get("/", index);

module.exports = router;
