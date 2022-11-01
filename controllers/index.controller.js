const { Food, FoodType } = require("../models/index");
module.exports = {
     homePage: async (req, res, next) => {
          res.locals.seo.title = "Trang Chủ";
          res.locals.seo.description = "";
          res.locals.seo.keywords = [
               "Foozie Home",
               "Foozie Foods",
               "Food Delivery",
          ];

          console.log(await Food.find().limit(5));

          res.render("home/index");
          res.end();
     },
     searchPage: async (req, res, next) => {
          res.locals.seo.title = "Tìm Kiếm";
          res.locals.seo.description = "Tìm kiếm món ăn trên Foozie Foods";
          res.locals.seo.keywords = [
               "Search Foods",
               "Tìm kiếm món ăn",
               "Search Foozie",
          ];

          let { q, type } = req.query;
          let typeIds = [];

          const foodTypes = await FoodType.find({});

          if (type) {
               type = /ALL/i.test(type) ? ["ALL"] : type.split(",");
               typeIds = type.includes("ALL")
                    ? []
                    : type.map((e) => {
                           return foodTypes.find((f) => f.code == e)?.id || "";
                      });
          } else {
               type = [];
          }

          const $regex = new RegExp(q, "i");

          console.log(typeIds);

          const foods = await Food.find({
               ...(q
                    ? {
                           $or: [
                                {
                                     name: { $regex },
                                },
                                { description: { $regex } },
                           ],
                      }
                    : {}),
               ...(typeIds.length ? { type: { $in: typeIds } } : {}),
          });

          console.log(foods);

          res.locals.body = {
               q,
               type: type || [],
          };
          res.locals.foodTypes = foodTypes || [];
          res.locals.foods = foods || [];
          res.render("home/search");
     },
};
