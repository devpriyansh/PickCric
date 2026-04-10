const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jackpot = sequelize.define('Jackpot', {
  matchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gameMode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jackpotName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subtitle2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jackpotType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  leagueName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  matchType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stats: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1 // Default to 1 (Live) when created
  },
  maxUserLimit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  topPrizes: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  availablePlayers: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'availablePlayers'
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rules: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isHotContest: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  showOnBanner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Jackpot;
