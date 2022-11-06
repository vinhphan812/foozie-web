const { SECRET_KEY } = process.env;

const cookieParser = require("cookie-parser");
const cookie = require("cookie");

const { User, Chat, Message } = require("../models/index");
const { ROLE } = require("../utils/role.enum");

/**
 *
 * @param {IO} io
 */

module.exports = (io) => {
     const adminIO = io.of("/admin");

     async function countNotSeen() {
          return await Message.count({ is_seen: false });
     }

     async function countNotSeenWithRoom(room) {
          return (await Message.count({ room, is_seen: false })).length;
     }

     adminIO.use(async (socket, next) => {
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
     });
     adminIO.on("connection", (socket) => {
          console.log(socket);
          socket.on("user_connect", (data) => {
               console.log(data);
          });

          socket.on("user:chat", async ({ roomid }) => {
               socket.data.currentRoom = roomid;
               let user;
               const room = await Chat.findOne({ _id: roomid });
               const messages = await Message.find({ room: roomid }).sort({
                    date: -1,
               });

               await Message.updateMany(
                    { room: roomid },
                    { $set: { is_seen: true } }
               );

               if (room.user) {
                    const { password, ...uData } = (
                         await User.findOne({
                              _id: room.user,
                         })
                    )._doc;
                    user = uData;
               } else {
                    const { name, phone, email } = room;

                    user = { name, phone, email };
               }
               const count = await countNotSeenWithRoom(roomid);
               socket.emit("res:count:room", { count, roomid });
               socket.emit("res:count", await countNotSeen());
               socket.emit("user:data", { user, room, messages });
          });
          socket.on("req:count", async () => {
               const data = await countNotSeen();
               console.log(data);
               socket.emit("res:count", data);
          });
          socket.on("req:chats", async () => {
               const data = await Chat.getAll();

               socket.emit("res:chats", data);
          });

          socket.on("req:seen", async (messageId) => {
               await Message.updateMany(
                    { _id: messageId },
                    { $set: { is_seen: true } }
               );
          });
     });
};
