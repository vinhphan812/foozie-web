const adminInit = require("./admin.socket");
/**
 * Message For Chat Formatter
 *   @Param {
 *        message: String,
 *        activities: Array<{title: String, reply: String}>
 *   }
 */
function send() {}

/**
 * Init SocketIO
 * @param {*} io is a socketio server
 */
module.exports = (io) => {
     io.engine.on("connection_error", (err) => {
          console.log(err.req);
          console.log(err.code);
          console.log(err.message);
          console.log(err.context);
     });

     adminInit(io);
};
