const { Order } = require("../../models");

module.exports = {
     updateStatusOrder: async (req, res, next) => {
          const { id } = req.params;
          const { status } = req.body;

          const new_status = await Order.nextStatus(id, status == "CANCEL");

          res.json({ success: true, data: { status: new_status } });
     },
};
