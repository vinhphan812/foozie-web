const { SCHEMA_OPTION, ignoreModel } = require("../utils/constaints");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderDetailSchema = new Schema(
     {
          order_id: { type: Schema.Types.ObjectId, ref: "ORDER" },
          food_id: { type: Schema.Types.ObjectId, ref: "FOOD" },
          quantity: Number,
     },
     SCHEMA_OPTION
);

orderDetailSchema.static({
     getDetails: async function (order) {
          const data = await this.find(
               { order_id: order },
               ignoreModel(["created_at", "updated_at", "order_id", "_id"])
          ).populate({ path: "food_id", populate: "type" });

          return data.map((e) => {
               return { ...e.food_id._doc, quantity: e.quantity };
          });
     },
});

const OrderDetail = mongoose.model(
     "ORDER_DETAIL",
     orderDetailSchema,
     "ORDER_DETAIL"
);

module.exports = OrderDetail;
