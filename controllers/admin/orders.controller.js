const { Order, Branch } = require("../../models");
const { status, status_pay, payment_method, status_level, status_step } = require("../../utils/term");
const { ROLE } = require("../../utils/role.enum");

module.exports = {
	index: async (req, res, next) => {
		const { user } = res.locals;

		res.locals.seo.title = "Đơn Hàng";
		res.locals.status_term = status;
		res.locals.status_pay_term = status_pay;
		res.locals.payment_term = payment_method;

		let branch;

		if (user.role == ROLE.MANAGER) {
			branch = await Branch.findOne({ manager: user._id });
		}

		res.locals.orders = await Order.getOrderDoneOrCancel(branch ? branch._id : null);
		res.locals.branch = branch;

		res.render("admin/orders/index");
	},
	getOrderById: async (req, res, next) => {
		const { id } = req.params;
		const order = await Order.getOrderDetail(id);
		if(!order) res.render("errors/404");

		res.locals.order = order;
		res.locals.status_term = status;
		res.locals.status_pay_term = status_pay;
		res.locals.payment_term = payment_method;
		res.locals.status_level = status_level;
		res.locals.status_step = status_step;

		res.locals.seo.title = "Chi tiết đơn hàng #" + order.id;
		res.render("admin/orders/order")
	}
};
