import bcrypt from "bcrypt";
import { ErrorCode, throwError } from "../../handlers/error.handler.js";
import { response } from "../../handlers/response.handler.js";
import { generate_token, verify_token } from "../../handlers/jwt.handler.js";
import {
  createUser,
  findOneUser,
} from "./user.queries.js";
import { createSession, revokeSession } from "../authorization/authorization.queries.js";
import useragent from "express-useragent";


export const register = async (req, res) => {
  const detail = { ...req.body };

  detail.password = bcrypt.hashSync(req.body.password, 8);

  const result = await findOneUser({ email: detail.email });
  // if (result) {
  //     return res.status(ErrorCode.DUPLICATE_DATA).json({
  //       success: false,
  //       message: "User already exists"
  //   })
  // }
  if (result) return throwError("User already exists", ErrorCode.DUPLICATE_DATA);

  const data = await createUser(detail);

  const dataObj = data.toObject();
  delete dataObj.password;

  return response(res, 200, true, "User added successfully", dataObj);
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await findOneUser({ value: username });
  console.log("user", user)

  if (!user) return throwError("User not found", ErrorCode.NOT_FOUND);

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect)
    return throwError("Invalid password", ErrorCode.UNAUTHORIZED);

  // Capture user agent and IP address from the request
  const device = useragent.parse(req.headers["user-agent"]);
  const ipAddress = req.ip;

  // Generate a new token and create a new session if no existing active session found
  const session = await createSession(user._id, device, ipAddress);
  const token = generate_token({ session_id: session._id });

  return response(res, 200, true, "Login successful", { token });
};

export const logout = async (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	
	const decoded = verify_token(token);
	const session_id = decoded.session_id;
	await revokeSession(session_id);
	// const revokedSession = await revokeSession(session_id);

	return response(res, 200, true, "Logout successful");
};