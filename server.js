
const express = require("express");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    console.error("Error creating database tables:", err);
  });
