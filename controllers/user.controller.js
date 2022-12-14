const { User, Order } = require("../models");
const { status, status_pay, payment_method, status_level, status_step } = require("../utils/term");
module.exports = {
     userDetails: async (req, res, next) => {
          const { user } = res.locals;
          res.locals.seo.title = "Hồ Sơ Của Tôi";
          res.render("users/details");
     },
     userUpdate: async  (req, res, next) => {
          const { user } = res.locals;
          const { password, role, ...body } = req.body;
          await User.updateOne({ _id: user.id }, { $set: body } )
          res.redirect("/user/profile");
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
     orderDetails: async (req, res, next) => {
          const { id } = req.params;
          const { user } = res.locals;

          const order = await Order.getOrderDetail(id);
          if(!order || order.user.id != user.id) return res.render("errors/404");

          res.locals.status_term = status;
          res.locals.status_pay_term = status_pay;
          res.locals.payment_term = payment_method;
          res.locals.status_level = status_level;
          res.locals.status_step = status_step;
         res.locals.order = order;
         res.locals.seo.title = "Chi tiết đơn hàng #" + order.id;

          res.render("admin/orders/order");
     }
};
