const { Order } = require("../models/index");
const adminController = require("./controllers/admin.controller");
const { adminAuth } = require("./middlewares/auth.middleware");

/**
 *
 * @param {IO} io
 */
module.exports = (io) => {
     const adminIO = io.of("/admin");
     const ctrler = adminController(io);

     // auth
     adminIO.use(adminAuth);

     adminIO.on("connection", async (socket) => {
          const orders = await Order.getOrderPendingWithDetais(
               socket.data.branch
          );

          socket.emit("orders", orders);

          socket.on("order:status", async ({ orderId, status }) => {
               const status_res = await Order.nextStatus(
                    orderId,
                    status == "CANCEL"
               );
               socket.emit("order:status", { orderId, status: status_res });
          });
     });
};
