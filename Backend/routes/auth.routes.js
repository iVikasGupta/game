import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

// 👇 REGISTER ENDPOINT
router.post("/register", register);

// 👇 LOGIN ENDPOINT
router.post("/login", login);

export default router;
