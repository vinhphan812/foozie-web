const { Food, FoodType } = require("../models/index");

module.exports = {
     getFoodByType: async (req, res, next) => {
          const { typeId } = req.params;
          const type = await FoodType.findById(typeId);
          const foodByType = await Food.find({ type: typeId });
          res.locals.seo.title = type.name;
          res.locals.foodByType = foodByType || undefined;
          res.locals.foodType = type || undefined;

          res.render("home/food-type");
     },
};
