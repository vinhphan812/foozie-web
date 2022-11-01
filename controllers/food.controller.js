const { Food, FoodType, Comment } = require("../models/index");

module.exports = {
     detailFood: async (req, res, next) => {
          const { idProduct } = req.params;

          const food = await Food.get(idProduct);
          const similarFood = await Food.find({ type: food.type });
          const comments = await Comment.find({ food: food._id });

          res.locals.seo.title = food.name;
          res.locals.seo.description = food.description;
          res.locals.seo.image = "https://" + req.hostname + food.thumbnail;
          res.locals.seo.keywords = [
               food.name,
               food.type.name + " Foozie Foods",
               "Foozie Foods " + food.type.name,
          ];
          if (food.description) res.locals.seo.keywords.push(food.description);

          res.locals.food = food || undefined;
          res.locals.similar = similarFood || undefined;
          res.locals.comments = comments;
          res.render("home/food");
     },
};
