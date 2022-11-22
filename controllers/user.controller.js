const { User, Order } = require("../models");
const { status, status_pay, payment_method } = require("../utils/term");
module.exports = {
     userDetails: async (req, res, next) => {
          const { user } = res.locals;
          res.locals.seo.title = "Hồ Sơ Của Tôi";
          res.render("users/details");
     },
     historyOrders: async (req, res, next) => {
          const { user } = res.locals;
          res.locals.seo.title = "Lịch Sử Hoạt Động";
          res.locals.seo.description = `Lịch sử đặt món của ${
               user.last_name + " " + user.first_name
          } trên Foozie Foods`;
          res.locals.status_term = status;
          res.locals.status_pay_term = status_pay;
          res.locals.payment_term = payment_method;
          res.locals.orders = await Order.getOrders(user.id);

          res.render("users/history");
     },
};
