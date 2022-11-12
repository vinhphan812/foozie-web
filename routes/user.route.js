const { Router } = require("express");
const {
     decentralization,
} = require("../api/middlewares/decentralization.middleware");
const { upload } = require("../configs/uploadFile");

const {
     userDetails,
     addToCart,
     removeFromCart,
} = require("../controllers/user.controller");
const { ROLE } = require("../utils/role.enum");

const router = Router();

router.use(decentralization(ROLE.CUSTOMER));

router.get("/profile", userDetails);

router.route("/cart").post(addToCart).delete(removeFromCart);

module.exports = router;
