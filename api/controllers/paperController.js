const Paper = require("../models/Paper");
const User = require("../models/User");

// Submit a new paper
exports.submitPaper = async (req, res) => {
  const { title, abstract, contentUrl } = req.body;
  try {
    const paper = await Paper.create({
      title,
      abstract,
      contentUrl,
      authorId: req.user.id,
    });
    res.status(201).json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all published papers (public)
exports.getPublishedPapers = async (req, res) => {
  try {
    const papers = await Paper.findAll({ where: { status: "published" } });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single paper by ID (public if published, or author/reviewer/admin)
exports.getPaperById = async (req, res) => {
  const { id } = req.params;
  try {
    const paper = await Paper.findByPk(id);
    if (!paper) return res.status(404).json({ error: "Paper not found" });
    if (
      paper.status !== "published" &&
      req.user?.id !== paper.authorId &&
      req.user?.role !== "admin" &&
      req.user?.id !== paper.reviewerId
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update paper (author only, if not published)
exports.updatePaper = async (req, res) => {
  const { id } = req.params;
  const { title, abstract, contentUrl } = req.body;
  try {
    const paper = await Paper.findByPk(id);
    if (!paper) return res.status(404).json({ error: "Paper not found" });
    if (paper.authorId !== req.user.id || paper.status === "published") {
      return res.status(403).json({ error: "Not authorized" });
    }
    paper.title = title || paper.title;
    paper.abstract = abstract || paper.abstract;
    paper.contentUrl = contentUrl || paper.contentUrl;
    await paper.save();
    res.json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete paper (author only, if not published)
exports.deletePaper = async (req, res) => {
  const { id } = req.params;
  try {
    const paper = await Paper.findByPk(id);
    if (!paper) return res.status(404).json({ error: "Paper not found" });
    if (paper.authorId !== req.user.id || paper.status === "published") {
      return res.status(403).json({ error: "Not authorized" });
    }
    await paper.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin: Approve or reject paper
exports.reviewPaper = async (req, res) => {
  const { id } = req.params;
  const { status, feedback, score, reviewerId } = req.body;
  try {
    const paper = await Paper.findByPk(id);
    if (!paper) return res.status(404).json({ error: "Paper not found" });
    if (req.user.role !== "admin" && req.user.role !== "reviewer") {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (status) paper.status = status;
    if (feedback) paper.feedback = feedback;
    if (score) paper.score = score;
    if (reviewerId) paper.reviewerId = reviewerId;
    await paper.save();
    res.json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
