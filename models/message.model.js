const mongoose = require("mongoose");
const { SCHEMA_OPTION } = require("../utils/constaints");
const { Schema } = mongoose;

const MessageSchema = new Schema(
     {
          room: { type: Schema.Types.ObjectId, ref: "CHAT" },
          message: String,
          type: { type: String, default: "text", enum: ["text", "status"] },
          is_seen: { type: Boolean, default: false },
          of: String,
          date: { type: Date, default: new Date() },
          is_deleted: { type: Boolean, default: false },
     },
     SCHEMA_OPTION
);

const Message = mongoose.model("MESSAGE", MessageSchema, "MESSAGE");

module.exports = Message;
