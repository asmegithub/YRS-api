const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const dialect = (process.env.DB_DIALECT || "postgres").toLowerCase();
const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const username = process.env.DB_USER || "postgres";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "YRPS";

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  logging: false,
  dialectOptions: dialect === "postgres" ? {} : {},
});

module.exports = sequelize;
