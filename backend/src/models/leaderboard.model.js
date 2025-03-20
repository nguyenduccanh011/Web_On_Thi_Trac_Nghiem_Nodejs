// src/models/leaderboard.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user.model');

const Leaderboard = sequelize.define('Leaderboard', {
    leaderboard_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'user_id',
        }
    },
    score: {
        type: DataTypes.DECIMAL(10, 2), // Điểm số (tổng 10 chữ số, 2 chữ số thập phân)
    },
    rank: {
        type: DataTypes.INTEGER,
    },
    last_attempt_date: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'leaderboard',
    timestamps: true, // Không cần timestamps
});

Leaderboard.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Leaderboard;