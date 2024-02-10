import * as db from "../../models/index.model.js";
import { ErrorCode, throwError } from "../../handlers/error.handler.js";

const createUser = async (detail) => {
	return await db.User.create(detail);
};

const findOneUser = async (filter) => {
	return await db.User.findOne(filter);
};

const findUsers = async (filter = {}, skip = 0, limit = 100) => {
	return await db.User.find(filter).skip(skip).limit(limit);
};

const getUserCount = async (filter = {}) => {
	return await db.User.countDocuments(filter);
};

const updateUserById = async (user_id, data) => {
	return await db.User.findByIdAndUpdate(user_id, data, { new: true });
};

const deleteOneUser = async (filter) => {
	if (!filter) throwError("Filter is required", ErrorCode.BAD_REQUEST);
	return await db.User.deleteOne(filter);
};

export { getUserCount, findUsers, findOneUser, createUser, updateUserById, deleteOneUser };
