// @ts-check
const Sequelize = require('sequelize');

const { sequelize } = require('./db-config.js');

module.exports.Contact = sequelize.define('contact', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
  },
  phoneNumber: {
    type: Sequelize.STRING(15),
  },
  title: { type: Sequelize.STRING },
  filePath: { type: Sequelize.ARRAY(Sequelize.STRING) },
  message: { type: Sequelize.TEXT },
});
