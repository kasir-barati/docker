// @ts-check
const Sequelize = require('sequelize');

const { sequelize } = require('./db-config.js');

module.exports.Order = sequelize.define('order', {
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
  },
  phoneNumber: {
    type: Sequelize.STRING(15),
    allowNull: false,
  },
  description: { type: Sequelize.STRING(1024) },
  filePath: { type: Sequelize.STRING },
});
