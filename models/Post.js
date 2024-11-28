// models/Post.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./User'); // Import User model

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

// Define the association (Post belongs to User)
Post.belongsTo(User, {
  foreignKey: 'userId', // Defines the foreign key in Post
  as: 'user', // Alias for easier access in queries
});

module.exports = Post;
