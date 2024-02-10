import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
        phone: {
			type: String,
			required: false,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
        avatar: {
			type: String,
			required: false,
		},
	},
	{ versionKey: false, timestamps: true }
);

export default model("user", userSchema, "users");
