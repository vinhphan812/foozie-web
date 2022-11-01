const { Food, FoodType } = require("../models/index");

module.exports = {
  detailFood: async (req, res, next) => {
    const { idProduct } = req.params;

    const food = await Food.get(idProduct);
    const similarFood = await Food.find({ type: food.type });
    res.locals.seo.title = food.name;
    res.locals.food = food || undefined;
    res.locals.similar = similarFood || undefined;

    res.render("home/food");
  },
};
