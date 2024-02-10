import { validationResult } from "express-validator";
import { throwError, ErrorCode } from "../handlers/error.handler.js";

export default function validate(schemas) {

    // console.log("schemas", schemas);

  return async (req, res, next) => {
        await Promise.all(schemas.map((schema) => schema.run(req)));

        const result = validationResult(req);
        if (result.isEmpty()) {
            return next();
        }
        console.log("result", result);

        const errors = result.array();

        // If there are validation errors, return error response
        return res.status(ErrorCode.BAD_REQUEST).json({
            success: false,
            message: errors[0].msg || 'Internal server error'
        })
    };
}
