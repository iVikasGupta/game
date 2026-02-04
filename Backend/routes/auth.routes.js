import express from "express";
import { register, login, adminLogin, setupAdmin } from "../controllers/auth.controller.js";

const router = express.Router();

// 👇 REGISTER ENDPOINT
router.post("/register", register);

// 👇 LOGIN ENDPOINT
router.post("/login", login);

// 👇 ADMIN LOGIN ENDPOINT
router.post("/admin-login", adminLogin);

// 👇 SETUP ADMIN (one-time use)
router.get("/setup-admin", setupAdmin);

export default router;
