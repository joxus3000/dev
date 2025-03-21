const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const db = require("../config/db");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/forgot-password", authController.forgotPassword);

module.exports = router;
