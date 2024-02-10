import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const sessionSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "user",
			default: null,
		},
		device: {
			type: Object
		},
		ip_address: {
			type: String,
		},
		is_active: {
			type: Boolean,
			default: true,
		},
	},
	{ versionKey: false, timestamps: true }
);

export default model("session", sessionSchema, "session");
