const { Router } = require("express");

const {
     Order,
     BuyHandle,
     createOrder,
     zalopayRes,
} = require("../controllers/order.controller");

const IdValidation = require("../validations/id.validation");

const {
     decentralization,
} = require("../api/middlewares/decentralization.middleware");
const { ROLE } = require("../utils/role.enum");

const router = Router();

// router.use(decentralization(ROLE.CUSTOMER));

router.route("/").get(Order).post(createOrder);

router.get("/buynow", BuyHandle);

router.get("/response", zalopayRes);

module.exports = router;
