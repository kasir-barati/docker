// @ts-check
const { Sequelize } = require("sequelize");

module.exports.sequelize = new Sequelize("db-name", "uname", "password", {
  host: "sitename-website-backend-db",
  port: 5432,
  dialect: "postgres",
});
