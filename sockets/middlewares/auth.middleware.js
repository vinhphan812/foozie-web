const { Chat, User } = require("../../models");
const { SECRET_KEY } = process.env;

const { ROLE } = require("../../utils/role.enum");

const cookieParser = require("cookie-parser");
const cookie = require("cookie");

async function createRoom(user) {
     return await Chat.create({
          ...(user._id
               ? { user: user._id }
               : {
                      name: user.name,
                      phone: user.phone,
                      email: user.email,
                 }),
     });
}

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
          console.log("auth done");
          next();
     },
     userAuth: async (socket, next) => {
          const { id, name, phone, email } = socket.request._query;
          if (!(name && phone && email) && !id) {
               next(new Error("User Not Detect"));
          }

          if (id) {
               const user = await User.findOne({ _id: id });
               if (!user) {
                    next(new Error("User Not Found"));
               }
               socket.data.user = {
                    ...user._doc,
                    name: user.last_name + " " + user.first_name,
               };
          } else {
               socket.data.user = { name, phone, email };
          }

          const chatRoom = await Chat.findOne({
               ...(id
                    ? { user: id }
                    : { $or: [{ name }, { phone }, { email }] }),
          });

          if (chatRoom) {
               socket.data.room = chatRoom;
          } else {
               socket.data.room = await createRoom(socket.data.user);
          }

          next();
     },
};
