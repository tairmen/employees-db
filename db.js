// database
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  // your Sequelize configuration
  dialect: 'sqlite',
  storage: 'database.db',
});

module.exports = { sequelize };