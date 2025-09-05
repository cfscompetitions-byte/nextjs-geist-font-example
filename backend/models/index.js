const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Import models
const User = require('./User');
const Office = require('./Office');
const Queue = require('./Queue');
const Token = require('./Token');

// Initialize models
const models = {
  User: User(sequelize, Sequelize.DataTypes),
  Office: Office(sequelize, Sequelize.DataTypes),
  Queue: Queue(sequelize, Sequelize.DataTypes),
  Token: Token(sequelize, Sequelize.DataTypes)
};

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
