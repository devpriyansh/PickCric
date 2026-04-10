const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  walletBalance: {
    type: DataTypes.FLOAT,
    defaultValue: 0 // Starting balance for the fantasy app
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user' // 'user' or 'admin'
  }
}, {
  timestamps: true
});

module.exports = User;