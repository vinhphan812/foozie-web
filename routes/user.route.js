const { Router } = require("express");
const {
     decentralization,
} = require("../api/middlewares/decentralization.middleware");
const { ROLE } = require("../utils/role.enum");
const { upload } = require("../configs/uploadFile");

const {
     userDetails,
     historyOrders, orderDetails, userUpdate,
} = require("../controllers/user.controller");
const IdValidation = require("../validations/id.validation");

const router = Router();

router.use(decentralization(ROLE.CUSTOMER));

router.get("/profile", userDetails);

router.post("/update", userUpdate)

router.get("/orders", historyOrders);

router.get("/orders/:id", IdValidation, orderDetails);

module.exports = router;
