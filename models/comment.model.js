const mongoose = require("mongoose");
const { SCHEMA_OPTION } = require("../utils/constaints");
const { Schema } = mongoose;

const CommentSchema = new Schema(
	{
		food: { type: Schema.Types.ObjectId, ref: "FOOD" },
		user: { type: Schema.Types.ObjectId, ref: "USER" },
		comment: String,
		rate: { type: Number, min: 0, max: 5 },
	},
	SCHEMA_OPTION
);

const Comment = mongoose.model("COMMENT", CommentSchema, "COMMENT");

module.exports = Comment;
