const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("student", "reviewer", "admin"),
    defaultValue: "student",
  },
  profilePictureUrl: {
    type: DataTypes.STRING,
  },
  institution: {
    type: DataTypes.STRING,
  },
});

module.exports = User;
