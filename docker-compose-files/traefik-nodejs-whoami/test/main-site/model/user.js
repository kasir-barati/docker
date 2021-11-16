// @ts-check
const Sequelize = require("sequelize");

const { sequelize } = require("./db-config.js");

module.exports.User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  phoneNumber: {
    type: Sequelize.STRING(15),
    allowNull: false,
  },
});
