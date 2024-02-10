import * as db from "../../models/index.model.js";

const createSession = async (user, device, ip) => {
	return await db.Session.create({ user, device, ip });
};

const getSessionById = async (session_id) => {
	return await db.Session.findById(session_id);
};

const getSessions = async (filter = {}, skip = 0, limit = 100) => {
	return await db.Session.find(filter).skip(skip).limit(limit);
};

const getSessionCount = async (filter = {}) => {
	return await db.Session.countDocuments(filter);
};

const revokeSession = async (session_id) => {
	return await db.Session.findByIdAndUpdate( session_id, { $set: { is_active: false } } );
};

const createPlatformSession = async (session_id, user_id, platform_id) => {
	return await db.PlatformSession.create({
		session_id,
		user_id,
		platform_id,
		is_active: true,
	});
};

const getPlatformSessionById = async (platform_session_id) => {
	return await db.PlatformSession.findById(platform_session_id);
};

export const populateUserPermission = async (user) => {
	const userWithPermissions = await db.User.findById(user._id).populate("permission");
	return userWithPermissions.permission;
};

export { createSession, getSessionById, getSessions, getSessionCount, revokeSession, createPlatformSession, getPlatformSessionById };
