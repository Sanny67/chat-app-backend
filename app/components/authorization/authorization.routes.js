import { Router } from "express";
import * as controller from "./authorization.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import validate from "../../../middleware/validator.js";
import * as validation from "./authorization.validation.js";

const router = Router();

// session token verification and temp token generator --> if true create temp token (30 sec) with sess_id
router.post("/temp-token", verifyToken, validate(validation.tempTokenGenerator), controller.tempTokenGenerator);

// temp token verifier from 3rd party platform
router.post("/generate-platform-token", validate(validation.platform_token_gen), controller.generatePlatformToken);

// temp token verifier from 3rd party platform
router.post("/verify-platform-token", validate(validation.verifyPlatformToken), controller.verifyPlatformToken);

export default router;
