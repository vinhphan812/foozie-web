const { Order, Branch } = require("../../models");
const { ROLE } = require("../../utils/role.enum");
const moment = require("moment");
const {
     button_status,
     status_pay,
     payment_method,
} = require("../../utils/term");

module.exports = {
     index: async (req, res, next) => {
          const { user } = res.locals;
          res.locals.seo.title = "Dashboard";

          let totals = { total: 0, foods: 0, shipping: 0 };
          let branch;

          if (user.role == ROLE.MANAGER) {
               branch = await Branch.findOne({ manager: user._id });
          }

          const [data] = await Order.getTotal(branch ? branch._id : null);

          if (data) {
               totals = data;
          }

          res.locals.status_button_term = button_status;
          res.locals.status_pay_term = status_pay;
          res.locals.payment_term = payment_method;
          res.locals.branch = branch;
          res.locals.totals = totals;

          res.render("admin/index");
     },
};
