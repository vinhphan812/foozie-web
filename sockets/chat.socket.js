const { APP_NAME } = process.env;
const { User, Chat, Message } = require("../models");
/**
 *
 * @param {IO} io
 */

module.exports = (io) => {
     const chatIO = io.of("/chats");

     function emitForAdmin(event_name, data) {
          io.of("/admin").emit(event_name, data);
     }
     function emitForChat(socket, message) {}

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

     chatIO.use(async (socket, next) => {
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
     });

     chatIO.on("connection", async (socket) => {
          console.log("connected ", socket.id);
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
