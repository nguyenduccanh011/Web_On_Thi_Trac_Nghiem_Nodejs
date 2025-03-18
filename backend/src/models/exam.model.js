// src/models/exam.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const ExamCategory = require('./exam_category.model');

const Exam = sequelize.define('Exam', {
    exam_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    exam_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ExamCategory,
            key: 'category_id',
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Sử dụng DataTypes.NOW để tự động lấy thời gian hiện tại
    },
    updated_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'exams',
    timestamps: true, // Bật timestamps (createdAt, updatedAt)
    updatedAt: 'updated_at', // Đặt tên tùy chỉnh cho trường updatedAt
    createdAt: 'created_at', // Đặt tên tùy chỉnh cho trường createdAt

});

Exam.belongsTo(ExamCategory, { foreignKey: 'category_id', as: 'category' });

module.exports = Exam;