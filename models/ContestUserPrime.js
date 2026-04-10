const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContestUserPrime = sequelize.define('ContestUserPrime', {
  jackpotId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false // Assumes every submission belongs to a logged-in user
  },
  totalScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0 // Default to 0 for now
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1 // 1 = Active/Joined
  },
  joinedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  tier: {
    type: DataTypes.STRING,
    allowNull: true // Can be populated later based on user ranking
  },
  prize: {
    type: DataTypes.STRING,
    allowNull: true // Will be populated after match finishes
  },
  correctPicksId: {
    type: DataTypes.JSONB,
    allowNull: true // We will store the array of the 11 selected player IDs here
  },
  selectedPlayers: {
    type: DataTypes.JSONB,
    allowNull: true // Stores the exact 11 players the user drafted
  }
}, {
  tableName: 'contestUserPrimes',
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = ContestUserPrime;