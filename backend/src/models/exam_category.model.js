// src/models/exam_category.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ExamCategory = sequelize.define('ExamCategory', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    category_name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'exam_categories',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
});

module.exports = ExamCategory;