const { Food, FoodType, Comment } = require("../models/index");

module.exports = {
     detailFood: async (req, res, next) => {
          const { id } = req.params;
          const { user } = res.locals;

          const food = await Food.get(id);

          if (!food) return next();

          const similars = await Food.find({ type: food.type });
          const comments = await Comment.find({ food: food._id }).populate(
               "user",
               ["first_name", "last_name", "avatar"]
          );

          if (user) {
               res.locals.scripts = ["/public/js/comment.js"];
          }

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
          res.locals.similars = similars;
          res.locals.comments = comments;
          res.render("home/food");
     },
     commentFood: async (req, res, next) => {
          const { user } = res.locals;
          const { id } = req.params;
          const { comment, stars } = req.body;

          const food = await Food.findOne({ _id: id });

          if (!food) return res.redirect("/");

          await Comment.create({
               food: id,
               user: user._id,
               comment,
               rate: stars,
               date: new Date(),
          });

          res.redirect("/foods/" + id);
     },
};
