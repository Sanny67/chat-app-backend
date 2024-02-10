import { Router } from "express";
import userRoute from "./components/users/user.routes.js";

const router = Router();

// All routes

// Users
router.use("/user", userRoute);

export default router;
