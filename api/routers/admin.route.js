const { Router } = require("express");
const { ROLE } = require("../../utils/role.enum");
const {
     decentralizationAPI,
} = require("../middlewares/decentralization.middleware");
const { upload } = require("../../configs/uploadFile");
const idValidate = require("../validations/id.validate");
const {
     deleteUser,
     deleteBranch,
     uploadFoodImageHandle,
} = require("../controllers/admin.controller");

const router = new Router();

router.use(decentralizationAPI(ROLE.ADMIN));

router.route("/users/:id").all(idValidate).delete(deleteUser);
router.route("/branches/:id").all(idValidate).delete(deleteBranch);
router.post(
     "/foods/:id/upload",
     upload("foods").single("image"),
     uploadFoodImageHandle
);

module.exports = router;
