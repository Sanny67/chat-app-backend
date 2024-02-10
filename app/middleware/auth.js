import { verify_token } from "../handlers/jwt.handler.js";
import { ErrorCode, throwError } from "../handlers/error.handler.js";
import { getSessionById } from "../components/authorization/authorization.queries.js";
import { findOneUser } from "../components/users/user.queries.js";

export const verifyToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) throwError("Token is missing", ErrorCode.UNAUTHORIZED);

	const token = authHeader.split("Bearer ")[1];

	const decoded = verify_token(token);
	const session_id = decoded.session_id;
	if (!session_id) throwError("Invalid token", ErrorCode.UNAUTHORIZED);

	const session = await getSessionById(session_id);
	if (!session || !session.is_active) throwError("Your session is inactive", ErrorCode.UNAUTHORIZED);

	const user = await findOneUser({ _id: session?.user });
	const userObj = user.toObject();
	delete userObj.password;

	req.token = token;
	req.session = session;
	req.user = user;
	next();
};