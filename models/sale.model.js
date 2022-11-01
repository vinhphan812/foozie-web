const mongoose = require("mongoose");
const { SCHEMA_OPTION } = require("../utils/constaints");
const { Schema } = mongoose;

const SaleSchema = new Schema(
     {
          food: { type: Schema.Types.ObjectId, ref: "FOOD" },
          start: { type: Date, default: new Date() },
          end: { type: Date, default: new Date() },
          discount: { type: Number, default: 10 },
     },
     SCHEMA_OPTION
);

const Sale = mongoose.model("SALE", SaleSchema, "SALE");

module.exports = Sale;
