const express = require("express");
const router = express.Router();
const paperController = require("../controllers/paperController");
const authenticateToken = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");

// Public: Get all published papers (supports query params: ?mine=true, ?status=all)
router.get("/", optionalAuth, paperController.getPublishedPapers);
// Public/Protected: Get single paper by id
// note: controller allows public access for published papers; remove strict auth middleware
router.get("/:id", paperController.getPaperById);
// Author: Submit new paper
router.post("/submit", authenticateToken, paperController.submitPaper);
// Author: Update paper
router.put("/:id", authenticateToken, paperController.updatePaper);
// Author: Delete paper
router.delete("/:id", authenticateToken, paperController.deletePaper);
// Admin/Reviewer: Review paper
router.post("/:id/review", authenticateToken, paperController.reviewPaper);

module.exports = router;
