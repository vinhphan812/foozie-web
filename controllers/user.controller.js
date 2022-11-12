const { User, Store, Food } = require("../models");

module.exports = {
     userDetails: async (req, res, next) => {
          const { user } = res.locals;
          res.locals.seo.title = "Hồ Sơ Của Tôi";
          res.render("users/details");
     },

     addToCart: async (req, res) => {
          const { food, type, quantity } = req.body;
          const { userId } = res.locals;

          if (food.length != 24) return "ID_NOT_VALID";

          if (!(await Food.findOne({ _id: food }))) return "FOOD_NOT_CONTAINS";
          // type is a [INCREASEMENT, DECREASEMENT]
          await Store.addCart(userId, food, parseInt(quantity));

          res.end();
     },

     removeFromCart: async (req, res) => {
          const { id } = req.body;
          console.log(id);
          await Store.clearCart({ id: id });
     },
};
