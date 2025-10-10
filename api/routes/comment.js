const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/commentController");
const authenticateToken = require("../middleware/auth");

// GET /api/research-papers/:paperId/comments
router.get("/", commentController.getCommentsForPaper);

// POST /api/research-papers/:paperId/comments
router.post("/", authenticateToken, commentController.postComment);

module.exports = router;
