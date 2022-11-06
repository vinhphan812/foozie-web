const mongoose = require("mongoose");
const { SCHEMA_OPTION } = require("../utils/constaints");
const Message = require("./message.model");
const { Schema } = mongoose;

const ChatSchema = new Schema(
     {
          socket_id: String,
          user: { type: Schema.Types.ObjectId, ref: "USER" },
          room: String,
          name: String,
          phone: String,
          email: String,
          is_deleted: { type: Boolean, default: false },
     },
     SCHEMA_OPTION
);

ChatSchema.static({
     getAll: async function () {
          const chats = await Chat.find(
               {},
               {},
               { sort: { created_at: -1 } }
          ).populate("user");

          for (var chat of chats) {
               const last_message = await Message.findOne(
                    {
                         room: chat.id,
                    },
                    {},
                    { sort: { created_at: -1 } }
               );
               chat._doc.last_message = last_message;
          }
          return chats;
     },
     get: async function (_id) {
          const chat = await Chat.findOne({ _id }).populate("user");
          const last_message = await Message.findOne(
               {
                    room: chat.id,
               },
               {},
               { sort: { created_at: -1 } }
          );
          chat._doc.last_message = last_message;
          return chat;
     },
});

const Chat = mongoose.model("CHAT", ChatSchema, "CHAT");

module.exports = Chat;
