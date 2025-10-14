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
  authors: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  keywords: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contentUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  submissionLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(
      "submitted",
      "under_review",
      "accepted",
      "rejected",
      "published"
    ),
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
