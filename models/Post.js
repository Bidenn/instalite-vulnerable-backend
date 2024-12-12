// models/Post.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./User'); 

const Post = sequelize.define('Post', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Post.belongsTo(User, {
  foreignKey: 'userId', 
  as: 'user', 
});

module.exports = Post;
