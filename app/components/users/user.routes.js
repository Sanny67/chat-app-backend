import { Router } from "express";
import * as controller from "./user.controller.js";
import validate from "../../middleware/validator.js";
import * as validation from "./user.validation.js";
import { verifyToken } from "../../middleware/auth.js";

const router = Router();

router.post("/register", validate(validation.userRegister), controller.register);

router.post("/login", validate(validation.userLogin), controller.login);

router.post("/logout", verifyToken, controller.logout);

export default router;
