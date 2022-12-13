const { Router } = require("express");
const { ROLE } = require("../../utils/role.enum");
const {
     decentralizationAPI,
} = require("../middlewares/decentralization.middleware");
const idValidate = require("../validations/id.validate");
const { updateStatusOrder } = require("../controllers/manager.controller.js");

const router = new Router();

router.use(decentralizationAPI(ROLE.MANAGER));

router.post("/orders/:id", idValidate, updateStatusOrder);

module.exports = router;
