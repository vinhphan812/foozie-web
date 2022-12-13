const { Router } = require("express");

const { index, getOrderById } = require("../../controllers/admin/orders.controller");
const IdValidation = require("../../validations/id.validation");

const router = new Router();

router.get("/", index);
router.get("/:id", IdValidation, getOrderById)

module.exports = router;
