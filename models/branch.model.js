const mongoose = require("mongoose");
const { SCHEMA_OPTION } = require("../utils/constaints");
const { Schema } = mongoose;

const BranchSchema = new Schema(
	{
		address: String,
		name: String,
		latLng: {
			latitude: Number,
			longitude: Number,
		},
		phone: { type: String, default: "0334561242" },
		manager: { type: Schema.Types.ObjectId, ref: "USER" },
		is_deleted: { type: Boolean, default: false },
	},
	SCHEMA_OPTION
);

const Branch = mongoose.model("BRANCH", BranchSchema, "BRANCH");

module.exports = Branch;
