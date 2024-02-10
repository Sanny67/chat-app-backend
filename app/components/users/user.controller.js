import bcrypt from "bcrypt";
import { ErrorCode, throwError } from "../../../handlers/error.handler.js";
import { response } from "../../../handlers/response.handler.js";
import { generate_token, verify_token } from "../../../handlers/jwt.handler.js";
import {
  findOneUser,
} from "./user.queries.js";
import { createSession, revokeSession } from "../authorization/authorization.queries.js";


export const register = async (req, res) => {
    console.log("req.body", req.body)
    // const { username, email, password, confirmPassword } = req.body;
    // const user = await findOneUser({ email });
  
    // if (!user) return throwError("User not found", ErrorCode.NOT_FOUND);
  
    // const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // if (!isPasswordCorrect)
    //   return throwError("Invalid password", ErrorCode.UNAUTHORIZED);
  
    // // Generate a new token and create a new session if no existing active session found
    // const session = await createSession(user._id, device, ipAddress);
    // const token = generate_token({ session_id: session._id });
  
    // return response(res, 200, true, "Login successful", { token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findOneUser({ email });

  if (!user) return throwError("User not found", ErrorCode.NOT_FOUND);

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect)
    return throwError("Invalid password", ErrorCode.UNAUTHORIZED);

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