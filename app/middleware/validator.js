import { validationResult } from "express-validator";
import { throwError, ErrorCode } from "../handlers/error.handler.js";

export default function validate(schemas) {

  return async (req, res, next) => {
        await Promise.all(schemas.map((schema) => schema.run(req)));

        const result = validationResult(req);
        if (result.isEmpty()) {
            return next();
        }

        const errors = result.array();
        // If there are validation errors, call next with an error
        next({ message: errors[0].msg, code: ErrorCode.BAD_REQUEST });
    };
}
