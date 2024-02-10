import { generate_token, verify_token } from "../../handlers/jwt.handler.js";
import { response } from "../../handlers/response.handler.js";
import { throwError, ErrorCode } from "../../handlers/error.handler.js";
import {
	getSessionById,
	createPlatformSession,
	getPlatformSessionById,
	populateUserPermission,
} from "./authorization.queries.js";
import { findOneUser } from "../users/users.queries.js";
import { findOnePlatform } from "../platform/platform.queries.js";

// This function will use the auth middleware of the central backend
export const tempTokenGenerator = async (req, res) => {
	const { user } = req;
	const platform = req.body.platform.toString();

	if (!user.platform_access.includes(platform)) {
		throwError("Platform access not allowed", ErrorCode.FORBIDDEN);
	}

	// Create a temporary token valid for 30 seconds based on the platform session id
	const temp_token = generate_token({ central_token: req.token, platform }, "30d");

	// Return the response with the temporary token
	return response(res, 200, true, "Temporary token generated successfully", {
		temp_token,
	});
};

// This function will use the auth middleware of the central backend
export const generatePlatformToken = async (req, res) => {
	const token = req.body.temp_token;

	if (!token) {
		throwError("Token not provided or invalid format", ErrorCode.UNAUTHORIZED);
	}

	const decodedToken = verify_token(token);
	if (!decodedToken) {
		throwError("Invalid token", ErrorCode.UNAUTHORIZED);
	}

	// Assigning platform id from decoded token
	const platform_id = decodedToken.platform;

	// Verify if the token is expired or not
	const sessionToken = verify_token(decodedToken.central_token);
	if (!sessionToken) {
		throwError("Invalid token", ErrorCode.UNAUTHORIZED);
	}

	const { session_id } = sessionToken;

	// Check if the session exists and is active in the session model
	const session = await getSessionById(session_id);
	if (!session || !session.is_active) {
		throwError("Invalid token or session not found", ErrorCode.UNAUTHORIZED);
	}

	// Check if the platform exists and the token was generated for this platform
	const platform = await findOnePlatform({ _id: platform_id });
	if (!platform || platform.backend_url !== req.hostname) {
		throwError("Platform not found or token generated for a different platform", ErrorCode.FORBIDDEN);
	}

	// Check if the user exists and has platform access
	const user = await findOneUser({ _id: session.user });
	if (!user || !user.platform_access.includes(platform._id)) {
		throwError("User not found or platform access not allowed", ErrorCode.FORBIDDEN);
	}

	const userWithPermissions = await populateUserPermission(user);

	// Create a platform session
	const platform_session = await createPlatformSession(session._id, user._id, platform._id);

	// Generate a platform token based on the platform session
	const platformToken = generate_token({ platform_session: platform_session._id });

	const data = { platformToken, userWithPermissions };

	// Return the response with the platform token
	return response(res, 200, true, "Platform token generated successfully", data);
};

// Verify the third-party token and platform session validity
export const verifyPlatformToken = async (req, res) => {
	const token = req.body.platform_token;

	const decodedToken = verify_token(token);
	if (!decodedToken) {
		throwError("Invalid token", ErrorCode.UNAUTHORIZED);
	}

	// Get the platform session id from the decoded token
	const platform_session_id = decodedToken.platform_session;

	// Check if the platform session exists and is active in the platform session model
	const platform_session = await getPlatformSessionById(platform_session_id);
	if (!platform_session || !platform_session.is_active) {
		throwError("Invalid token or platform session not found", ErrorCode.UNAUTHORIZED);
	}

	// Check if the platform exists and the token was generated for this platform
	const platform = await findOnePlatform({ _id: platform_session.platform_id });
	if (!platform || platform.backend_url !== req.hostname) {
		throwError("Platform not found or token generated for a different platform", ErrorCode.FORBIDDEN);
	}

	// Check if the user exists and has platform access
	const user = await findOneUser({ _id: platform_session.user_id });
	if (!user) {
		throwError("User not found", ErrorCode.NOT_FOUND);
	}

	// TODO - Send permissions assigned to the user for this platform
	// Return the response indicating that the token is valid
	return response(res, 200, true, "Token valid");
};
