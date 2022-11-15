const { Router } = require("express");

const {
     Order,
     BuyHandle,
     zalopayRes,
} = require("../controllers/order.controller");
const {
     decentralization,
} = require("../api/middlewares/decentralization.middleware");
const { ROLE } = require("../utils/role.enum");

const router = Router();

router.use(decentralization(ROLE.CUSTOMER));

router.route("/").get(Order).post();
router.post("/buy", BuyHandle);
router.get("zalopay-response", zalopayRes);

module.exports = router;
