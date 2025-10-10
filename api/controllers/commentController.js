const Comment = require("../models/Comment");
const Paper = require("../models/Paper");

// GET comments for a paper
exports.getCommentsForPaper = async (req, res) => {
  const { paperId } = req.params;
  try {
    const paper = await Paper.findByPk(paperId);
    if (!paper) return res.status(404).json({ error: "Paper not found" });

    const comments = await Comment.findAll({ where: { paperId } });
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST a new comment (authenticated)
exports.postComment = async (req, res) => {
  const { paperId } = req.params;
  const { text, parentCommentId } = req.body;
  try {
    const paper = await Paper.findByPk(paperId);
    if (!paper) return res.status(404).json({ error: "Paper not found" });

    const comment = await Comment.create({
      paperId,
      authorId: req.user.id,
      text,
      parentCommentId: parentCommentId || null,
    });
    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
