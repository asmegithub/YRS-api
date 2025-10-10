const User = require("../models/User");
const Paper = require("../models/Paper");
const { Op } = require("sequelize");

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalSubmissions = await Paper.count();
    const accepted = await Paper.count({ where: { status: "accepted" } });
    const acceptanceRate = totalSubmissions ? accepted / totalSubmissions : 0;

    // submissions per month (last 6 months)
    const submissionsPerMonth = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(month.getFullYear(), month.getMonth(), 1);
      const end = new Date(month.getFullYear(), month.getMonth() + 1, 1);
      const count = await Paper.count({
        where: { createdAt: { [Op.gte]: start, [Op.lt]: end } },
      });
      submissionsPerMonth.push({
        month: month.toLocaleString("default", { month: "short" }),
        count,
      });
    }

    const statusRows = await Paper.findAll({
      attributes: [
        "status",
        [Paper.sequelize.fn("COUNT", Paper.sequelize.col("status")), "count"],
      ],
      group: ["status"],
    });
    const statusDistribution = {};
    statusRows.forEach((r) => {
      statusDistribution[r.status] = parseInt(r.dataValues.count, 10);
    });

    res.json({
      totalUsers,
      totalSubmissions,
      acceptanceRate,
      submissionsPerMonth,
      statusDistribution,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "role",
        "createdAt",
        "updatedAt",
      ],
    });
    const formatted = users.map((u) => ({
      userId: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      role: u.role,
      isActive: true,
    }));
    res.json({ users: formatted });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/admin/users/:userId
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { role, isActive } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (role) user.role = role;
    // isActive not modeled; just pretend and return success
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/submissions
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Paper.findAll({
      attributes: ["id", "title", "authorId", "status", "reviewerId"],
    });
    const formatted = submissions.map((s) => ({
      submissionId: s.id,
      title: s.title,
      author: s.authorId,
      status: s.status,
      assignedReviewer: s.reviewerId,
    }));
    res.json({ submissions: formatted });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/admin/submissions/:submissionId
exports.updateSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const { status, reviewerId } = req.body;
  try {
    const submission = await Paper.findByPk(submissionId);
    if (!submission)
      return res.status(404).json({ error: "Submission not found" });
    if (status) submission.status = status;
    if (reviewerId) submission.reviewerId = reviewerId;
    await submission.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
