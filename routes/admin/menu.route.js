const { Router } = require("express");

const { index } = require("../../controllers/admin/menu.controller");

const router = new Router();

router.get("/", index);

module.exports = router;
