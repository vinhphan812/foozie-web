const { Food, FoodType } = require("../../models/index");
const { getFoodType } = require("../../utils/redis");

module.exports = {
     index: async (req, res, next) => {
          res.locals.seo.title = "Menu";
          const foods = await Food.getAll();
          res.locals.foods = foods;
          res.render("admin/menu/index");
     },
     editPage: async (req, res, next) => {
          const { id } = req.params;

          const food = await Food.get(id);

          if (!food) return next();
          res.locals.seo.title = "Chỉnh sửa " + food.name;
          res.locals.types = await getFoodType();

          res.locals.body = food;

          res.render("admin/menu/food");
     },
     updateFood: async (req, res, next) => {
          const { id } = req.params;
          const { body, errors } = res.locals;
          res.locals.seo.title = "Chỉnh sửa " + body.name;
          res.locals.types = await getFoodType();

          if (errors.length) return res.render("admin/menu/food");

          await Food.updateOne({ _id: id }, { $set: body });

          res.redirect("/admin/menu/");
     },
     createPage: async (req, res, next) => {
          res.locals.seo.title = "Tạo Món ăn";
          res.locals.isCreate = true;

          res.locals.types = await getFoodType();

          res.render("admin/menu/food");
     },
     createFoodHandler: async (req, res, next) => {
          const { errors, body } = res.locals;

          if (errors.length) {
               res.locals.seo.title = "Tạo Món ăn";
               res.locals.isCreate = true;
               res.locals.types = await getFoodType();

               return res.render("admin/menu/food");
          }

          body.thumbnail = "/" + req.file.path.split("\\").join("/");

          await Food.create(body);

          res.redirect("/admin/menu/");
     },
};
