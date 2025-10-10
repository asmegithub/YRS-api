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
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/research-papers/:paperId/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    console.error("Error creating database tables:", err);
  });
