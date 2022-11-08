const { APP_NAME } = process.env;
const { Chat, Message } = require("../models");
const { userAuth } = require("./middlewares/auth.middleware");
const ChatController = require("./controllers/chat.controller");

async function newMessage(room, message, of, type = "text") {
     await Message.create({
          date: new Date(),
          room,
          message,
          of,
          type,
     });
     return await Chat.get(room);
}

/**
 *
 * @param {IO} io
 */
module.exports = (io) => {
     const chatIO = io.of("/chats");
     const ctrler = ChatController(io);

     function emitForAdmin(event_name, data) {
          io.of("/admin").emit(event_name, data);
     }
     function emitForChat(socket, message) {}

     chatIO.use(userAuth);

     chatIO.on("connection", async (socket) => {
          const { name } = socket.data.user;
          console.log(socket);
          const chat = await newMessage(
               socket.data.room._id,
               name + " vừa kết nối với kênh chat.",
               null,
               "status"
          );

          emitForAdmin("changed", chat);

          socket.emit("first", {
               name: APP_NAME,
               message: `Chào mừng ${name} đến với Foozie Foods`,
               activities: [
                    { title: "Hổ trợ báo cáo", reply: "Hổ trợ báo cáo" },
                    { title: "Phàn nàn", reply: "Phàn nàn" },
               ],
          });

          socket.on("message", async (data) => {
               console.log(data);
               console.log(socket);

               const chat = await newMessage(
                    socket.data.room._id,
                    data.message,
                    socket.data.user._id || socket.data.room._id
               );

               emitForAdmin(
                    "res:count",
                    await Message.count({ room: socket.data.room._id })
               );

               emitForAdmin("user:inbox", chat);

               data.message = "reply => " + data.message;
               socket.emit("message", data);
          });

          socket.on("disconnect", async (reasons) => {
               console.log(socket.id, "disconnect", reasons);

               const chat = await newMessage(
                    socket.data.room._id,
                    `${name} đã kết thúc trò chuyện.`,
                    null,
                    "status"
               );
               emitForAdmin("changed", chat);
          });
     });
};
