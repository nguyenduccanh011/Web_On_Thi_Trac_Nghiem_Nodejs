// src/models/user.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING(100),
    },
    registration_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    last_login: {
        type: DataTypes.DATE,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
    },
    profile_picture: {
        type: DataTypes.STRING(255),
    },
    resetToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    resetTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'users',
    timestamps: true, // Bạn đã tắt timestamps ở đây.  Nếu muốn có createdAt/updatedAt, hãy đặt là true.
});

module.exports = User;