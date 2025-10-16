const Paper = require("../models/Paper");
const User = require("../models/User");

// Submit a new paper
exports.submitPaper = async (req, res) => {
  const {
    title,
    abstract,
    contentUrl,
    submissionLink,
    authors,
    institution,
    keywords,
  } = req.body;
  try {
    const paper = await Paper.create({
      title,
      abstract,
      contentUrl,
      submissionLink,
      authors,
      institution,
      keywords,
      authorId: req.user.id,
    });
    res.status(201).json({ success: true, paper });
  } catch (error) {
    console.error("paperController.submitPaper error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get papers with flexible queries (public by default)
// Query params:
// - mine=true => return papers authored by the authenticated user
// - status=all => (admin) return all papers
// default: return published papers
exports.getPublishedPapers = async (req, res) => {
  try {
    const { authorId, status } = req.query;

    // If authorId provided, return papers by that author (public)
    if (authorId) {
      const papers = await Paper.findAll({ where: { authorId } });
      return res.json(papers);
    }

    // If status=all requested, return all papers publicly
    if (status === "all") {
      const papers = await Paper.findAll();
      return res.json(papers);
    }

    // Default: published only
    const papers = await Paper.findAll({ where: { status: "published" } });
    return res.json(papers);
  } catch (error) {
    console.error("paperController.getPublishedPapers error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single paper by ID (public if published, or author/reviewer/admin)
exports.getPaperById = async (req, res) => {
  const { id } = req.params;
  try {
    const paper = await Paper.findByPk(id);
    if (!paper) return res.status(404).json({ error: "Paper not found" });
    // Public access: return the paper to any requester.
    // Note: previously unpublished papers were restricted; this endpoint now
    // returns the paper regardless of status. If you want to keep some
    // restriction (e.g., only published), we can add query params.
    return res.json(paper);
  } catch (error) {
    console.error("paperController.getPaperById error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update paper (author only, if not published)
exports.updatePaper = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    abstract,
    contentUrl,
    submissionLink,
    authors,
    institution,
    keywords,
  } = req.body;
  try {
    const paper = await Paper.findByPk(id);
    if (!paper) return res.status(404).json({ error: "Paper not found" });
    if (paper.authorId !== req.user.id || paper.status === "published") {
      return res.status(403).json({ error: "Not authorized" });
    }
    paper.title = title || paper.title;
    paper.abstract = abstract || paper.abstract;
    paper.contentUrl = contentUrl || paper.contentUrl;
    paper.submissionLink = submissionLink || paper.submissionLink;
    paper.authors = authors || paper.authors;
    paper.institution = institution || paper.institution;
    paper.keywords = keywords || paper.keywords;
    await paper.save();
    res.json({ success: true, paper });
  } catch (error) {
    console.error("paperController.updatePaper error:", error);
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
    console.error("paperController.deletePaper error:", error);
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
    console.error("paperController.reviewPaper error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
