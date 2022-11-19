const {
     SCHEMA_OPTION,
     checkInvalidID,
     ignoreModel,
     DEFAULT_SHIPPING_FEE,
} = require("../utils/constaints");

const mongoose = require("mongoose");

const Store = require("./store.model");
const OrderDetail = require("./order_detail.model");
const Voucher = require("./voucher.model");
const Food = require("./food.model");

const { Schema } = mongoose;

const OrderSchema = new Schema(
     {
          total_foods: Number,
          order_date: { type: Date, default: new Date() },
          voucher_using: { type: Schema.Types.ObjectId, ref: "VOUCHER" },
          is_delete: { type: Boolean, default: false },
          delivery: String,
          user: { type: Schema.Types.ObjectId, ref: "USER" },
          branch: { type: Schema.Types.ObjectId, ref: "BRANCH" },
          payment_method: {
               type: String,
               default: "COD",
               enum: ["COD", "PAYMENT"],
          },
          payment_status: {
               type: String,
               default: "UNPAID",
               enum: ["UNPAID", "PAID"],
          },
          status: {
               type: String,
               default: "PENDING",
               enum: ["PENDING", "PREPARE", "SHIPPING", "DONE", "CANCEL"],
          },
          note: String,
          shipping_fee: { type: Number, default: 0 },
          total: Number,
     },
     SCHEMA_OPTION
);

OrderSchema.static({
     createOrder: async function (
          sessionId,
          user,
          cart,
          branch,
          note,
          voucher_using,
          shipping_fee,
          delivery,
          payment_method
     ) {
          const data = await Store.getCart(sessionId);

          if (!data.length)
               return { success: false, message: "FOOD_ORDER_IS_EMPTY" };

          // check id
          if (voucher_using) {
               if (checkInvalidID(voucher_using))
                    return { success: false, message: "VOUCHER_ID_INVALID" };
               voucher_using = await Voucher.findOne({ _id: voucher_using });
          }

          //create order
          const myOrder = await this.create({
               payment_method,
               branch,
               note,
               user,
               shipping_fee: shipping_fee,
               delivery,
          });

          // make order detail
          await OrderDetail.create(
               cart.map((e) => ({
                    order_id: myOrder.id,
                    food_id: e._doc._id,
                    quantity: e._doc.quantity,
               }))
          );

          let total_foods = 0,
               total = 0;

          for (const item of cart) {
               const { price, quantity } = item;
               total_foods += price * quantity;
          }

          if (voucher_using) {
               const discount = await Voucher.checkValidAndDiscount(
                    voucher_using.id,
                    total_foods,
                    shipping_fee
               );

               if (!discount.success) {
                    await Order.deleteOne({ _id: myOrder.id });
                    await OrderDetail.deleteMany({ order_id: myOrder.id });
                    return { success: false, message: discount.message };
               }

               total = discount.data.price + discount.data.shipping_fee;
          } else {
               if (shipping_fee) total = shipping_fee + total_foods;
               else total = DEFAULT_SHIPPING_FEE + total_foods;
          }

          await Order.updateOne(
               { _id: myOrder.id },
               { $set: { total_foods, total } }
          );

          //TODO: create NOTIFICATION

          Store.clearCart(sessionId);

          return {
               success: true,
               message: "ORDER_CREATED_SUCCESS",
               total,
               order_id: myOrder.id,
          };
     },
     getOrders: async function (user) {
          const orders = await this.find({ user }, ignoreModel())
               .populate("branch", ["name"])
               .sort({ order_date: -1 });

          return orders;
     },
     getOrderDetail: async function (_id) {
          const order = await this.findOne({ _id }).populate("branch");
          const data = await OrderDetail.find(
               { order_id: order.id },
               ignoreModel(["created_at", "updated_at", "order_id", "_id"])
          ).populate({ path: "food_id", populate: "type" });

          order._doc.details = data.map((e) => {
               return { ...e.food_id._doc, quantity: e.quantity };
          });
          order.details = order._doc.details;
          return order;
     },
});

const Order = mongoose.model("ORDER", OrderSchema, "ORDER");

module.exports = Order;
