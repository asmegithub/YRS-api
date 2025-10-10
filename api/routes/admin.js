const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticateToken = require("../middleware/auth");
const { isAdmin } = require("../middleware/roles");

router.get("/stats", authenticateToken, isAdmin, adminController.getStats);
router.get("/users", authenticateToken, isAdmin, adminController.getUsers);
router.put(
  "/users/:userId",
  authenticateToken,
  isAdmin,
  adminController.updateUser
);
router.get(
  "/submissions",
  authenticateToken,
  isAdmin,
  adminController.getSubmissions
);
router.put(
  "/submissions/:submissionId",
  authenticateToken,
  isAdmin,
  adminController.updateSubmission
);

module.exports = router;
