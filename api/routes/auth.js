const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");

// Register
router.post("/register", authController.registerUser);
// Login
router.post("/login", authController.loginUser);
// Example protected route
router.get("/me", authenticateToken, authController.getProfile);

module.exports = router;
