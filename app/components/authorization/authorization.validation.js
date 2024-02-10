import { body } from "express-validator";

// Validation for tempTokenGenerator API
export const tempTokenGenerator = [body("platform").notEmpty().withMessage("Platform is required")];

// Validation for generatePlatformToken API
export const platform_token_gen = [body("temp_token").notEmpty().withMessage("Temporary token is required")];

// Validation for verifyPlatformToken API
export const verifyPlatformToken = [body("platform_token").notEmpty().withMessage("Platform token is required")];
