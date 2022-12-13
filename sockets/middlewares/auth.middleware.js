const { Chat, User, Branch } = require("../../models");
const { SECRET_KEY } = process.env;

const { ROLE } = require("../../utils/role.enum");

const cookieParser = require("cookie-parser");
const cookie = require("cookie");

module.exports = {
     adminAuth: async (socket, next) => {
          const cookies = cookie.parse(socket.request.headers["cookie"]);

          if (!cookies || !Object.keys(cookies).length) {
               socket.disconnect();
               return;
          }

          const { userId } = cookieParser.signedCookies(cookies, SECRET_KEY);

          if (!userId) {
               socket.disconnect();
               return;
          }

          const user = await User.findOne({ _id: userId });

          if (user.role != ROLE.ADMIN && user.role != ROLE.MANAGER) {
               socket.disconnect();
               return;
          }

          socket.data.user = user;

          if (user.role == ROLE.MANAGER) {
               socket.data.branch = await Branch.findOne({ manager: user._id });
          }

          console.log("auth done");
          next();
     },
};
