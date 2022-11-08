const { User, Chat, Message } = require("../models/index");
const adminController = require("./controllers/admin.controller");
const { adminAuth } = require("./middlewares/auth.middleware");

/**
 *
 * @param {IO} io
 */

async function countNotSeen() {
     return await Message.count({ is_seen: false });
}

async function countNotSeenWithRoom(room) {
     return (await Message.count({ room, is_seen: false })).length;
}

module.exports = (io) => {
     const adminIO = io.of("/admin");
     const ctrler = adminController(io);

     // auth
     adminIO.use(adminAuth);

     adminIO.on("connection", (socket) => {
          console.log(socket, io);

          socket.on("chatChanged", (chat) => {
               socket.emit("changed", chat);
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
          socket.on("req:count", async (arg) => {
               console.trace();
               const data = await countNotSeen();
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
