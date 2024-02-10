import { Router } from "express";
import userRoute from "./components/users/user.routes.js";

const router = Router();

// All routes

// Users
router.post("/user/register1", ()=>{
    console.log("try")
});

router.use("/user", userRoute);

export default router;
