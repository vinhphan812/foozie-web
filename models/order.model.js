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
const moment = require("moment");

const { Schema } = mongoose;

const nextStatusOrder = {
     PENDING: "PREPARE",
     PREPARE: "SHIPPING",
     SHIPPING: "DONE",
};

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
               shipping_fee: shipping_fee || DEFAULT_SHIPPING_FEE,
               delivery,
          });

          // make order detail
          await OrderDetail.create(
               data.map((e) => ({
                    order_id: myOrder.id,
                    food_id: e._doc._id,
                    quantity: e._doc.quantity,
               }))
          );

          let total_foods = 0,
               total = 0;

          for (const { _doc } of data) {
               const { price, quantity } = _doc;
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
          } else total = shipping_fee + total_foods;

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
     getOrderDoneOrCancel: async function (branch) {
          const orders = await this.find({
               ...(branch ? { branch: branch } : {}),
               status: { $in: ["DONE", "CANCEL"] },
          }).sort({ order_date: -1 }).populate(["user", "branch"]);

          return orders;
     },
     getOrderPendingWithDetais: async function (branch) {
          const orders = await this.find({
               ...(branch ? { branch: branch } : {}),
               status: { $nin: ["DONE", "CANCEL"] },
          }).sort({ order_date: -1 });

          for (const order of orders) {
               const details = await OrderDetail.getDetails(order.id);
               order._doc.details = details;
               order.details = details;
          }

          return orders;
     },
     getOrderDetail: async function (_id) {
          const order = await this.findOne({ _id }).populate(["branch", "user"]);
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
     nextStatus: async function (_id, isCancel = false) {
          const order = await this.findOne({ _id });

          if (order.status === "DONE" || order.status === "CANCEL")
               return order.status;

          order.status = isCancel ? "CANCEL" : nextStatusOrder[order.status];

          await order.save();

          return order.status;
     },
     getTotal: function (branch) {
          const current = moment().format("yyyy-MM-DD");
          return this.aggregate([
               {
                    $match: {
                         ...(branch ? { branch: branch } : {}),
                         updated_at: {
                              $gte: new Date(current + " 00:00:00"),
                              $lte: new Date(current + " 23:59:59"),
                         },
                    },
               },
               {
                    $group: {
                         _id: null,
                         total: { $sum: "$total" },
                         foods: { $sum: "$total_foods" },
                         shipping: { $sum: "$shipping_fee" },
                    },
               },
          ]);
     },
});

const Order = mongoose.model("ORDER", OrderSchema, "ORDER");

module.exports = Order;
