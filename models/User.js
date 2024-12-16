const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    username: { 
        type: DataTypes.STRING, 
        unique: true 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    fullname: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    photo: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    career: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    bio: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    sessionId: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
});

module.exports = User;
