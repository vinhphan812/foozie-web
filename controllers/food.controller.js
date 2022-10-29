const { Food } = require("../models/index");

module.exports = {
  detailFood: async (req, res, next) => {
    const { id } = req.params;
    const food = await Food.findOne({ _id: id });
  },
};
