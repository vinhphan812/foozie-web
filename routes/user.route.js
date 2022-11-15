const { Router } = require("express");
const {
     decentralization,
} = require("../api/middlewares/decentralization.middleware");
const { ROLE } = require("../utils/role.enum");
const { upload } = require("../configs/uploadFile");

const { userDetails } = require("../controllers/user.controller");

const router = Router();

router.use(decentralization(ROLE.CUSTOMER));

router.get("/profile", userDetails);

module.exports = router;
