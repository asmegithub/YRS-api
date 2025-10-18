const express = require("express");
const sequelize = require("./config/db");

const paperRoutes = require("./routes/paper");
const authRoutes = require("./routes/auth");
const commentRoutes = require("./routes/comment");
const adminRoutes = require("./routes/admin");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://yrps-deployment.vercel.app"],
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/research-papers/:paperId/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

// In development, use `alter: true` so Sequelize updates tables to match models.
// For production, use migrations instead.
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced (alter applied if needed)");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});
