const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

// Debug check
console.log("Loaded DB ENV:", {
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
});

const dialect = process.env.DB_DIALECT || "postgres";
const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const username = process.env.DB_USER || "postgres";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "postgres";

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // important for Render
    },
  },
});

module.exports = sequelize;
