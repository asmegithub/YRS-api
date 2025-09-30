const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Paper = sequelize.define("Paper", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  abstract: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  contentUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("submitted", "under_review", "accepted", "rejected", "published"),
    defaultValue: "submitted",
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Paper;
