const express = require("express");
const router = express.Router();
const paperController = require("../controllers/paperController");
const authenticateToken = require("../middleware/auth");

// Public: Get all published papers
router.get("/", paperController.getPublishedPapers);
// Public/Protected: Get single paper by id
router.get("/:id", authenticateToken, paperController.getPaperById);
// Author: Submit new paper
router.post("/submit", authenticateToken, paperController.submitPaper);
// Author: Update paper
router.put("/:id", authenticateToken, paperController.updatePaper);
// Author: Delete paper
router.delete("/:id", authenticateToken, paperController.deletePaper);
// Admin/Reviewer: Review paper
router.post("/:id/review", authenticateToken, paperController.reviewPaper);

module.exports = router;
