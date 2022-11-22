const { Router } = require("express");

const { upload } = require("../../configs/uploadFile");

const {
     index,
     editPage,
     updateFood,
     createPage,
     createFoodHandler,
} = require("../../controllers/admin/menu.controller");

const { createFoodValidation } = require("../../validations/create.validation");

const idValidation = require("../../validations/id.validation");

const router = new Router();

router.get("/", index);

router
     .route("/create")
     .get(createPage)
     .post(
          upload("foods").single("image"),
          createFoodValidation,
          createFoodHandler
     );

router
     .route("/:id/update")
     .all(idValidation)
     .get(editPage)
     .post(createFoodValidation, updateFood);

module.exports = router;
