const { Store, VirtualDisplayVoucher, Food, Order } = require("../models");
const Zalopay = require("../modules/zalopay");

module.exports = {
     Order: async (req, res, next) => {
          const { user, cart } = res.locals;
          res.locals.seo.title = "Thanh Toán";

          if (!cart.length) return res.redirect("/");

          res.locals.vouchers = await VirtualDisplayVoucher.myVouchers(
               user._id
          );
          res.locals.total = cart.reduce((r, e) => {
               return r + e.price * e.quantity;
          }, 0);

          res.render("order/index");
     },
     createOrder: async (req, res, next) => {
          const {
               delivery,
               voucher,
               payment_method,
               branch,
               note,
               shipping_fee,
          } = req.body;
          const { sessionId, userId } = req.signedCookies;

          const { order_id, success, message } = await Order.createOrder(
               sessionId,
               userId,
               branch,
               note,
               voucher,
               +shipping_fee,
               delivery,
               payment_method == "online" ? "PAYMENT" : "COD"
          );

          if (!success) {
               res.redirect("/");
          }

          const order = await Order.getOrderDetail(order_id);

          if (payment_method == "online" && order) {
               const data = await Zalopay.createOrder(
                    order,
                    req.headers.host != "localhost:3000"
                         ? req.headers.host
                         : "5f97-2405-4803-c643-ad00-8d82-3fe5-8503-46b6.ngrok.io"
               );
               if (data.return_code == 1) {
                    return res.redirect(data.order_url);
               }
          }
          res.redirect("/orders/" + order_id);
     },
     BuyHandle: async (req, res, next) => {
          const { food, quantity } = req.query;
          const { user } = res.locals;

          const { sessionId } = req.signedCookies;

          if (!food) return res.redirect(req.header("Referer") || "/");

          const foodData = await Food.findOne({ _id: food });

          if (!foodData) return res.redirect(req.header("Referer") || "/");

          await Store.addCart(sessionId, food, "INCREASEMENT", +quantity || 1);

          if (!user) {
               return res.redirect("/sign_in");
          }

          res.redirect("/order");
     },
     zalopayRes: async (req, res, next) => {
          const {
               appid,
               apptransid,
               pmcid,
               bankcode,
               amount,
               discountamount,
               status,
               checksum,
          } = req.query;

          const [time, orderId] = apptransid.split("_");

          const checksumRes = Zalopay.Hmac(
               `${appid}|${apptransid}|${pmcid}|${bankcode}|${amount}|${discountamount}|${status}`,
               Zalopay.config.key2
          );

          if (checksumRes != checksum) {
               return res.sendStatus(400);
          }

          if (status == "1")
               await Order.updateOne(
                    { _id: orderId },
                    { $set: { payment_status: "PAID" } }
               );

          res.locals.orderId = orderId;
          res.locals.status = status;
          res.locals.seo.title =
               "Thanh Toán Đơn Hàng #" +
               orderId +
               " " +
               (status == "1" ? "thành công" : "thất bại");

          res.render("order/result");
     },
};
