import { body, check, param } from "express-validator";

export const userRegister = [
	body("username").trim().notEmpty().withMessage("Username is required."),
	body("email").trim().notEmpty().withMessage("Email is required.").isEmail().withMessage("Invalid email address."),
	body("password").trim().notEmpty().withMessage("Password is required."),
	body("confirmPassword").trim().notEmpty().withMessage("Confirm password is required."),
];