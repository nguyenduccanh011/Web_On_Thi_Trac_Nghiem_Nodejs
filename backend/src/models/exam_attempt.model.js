// src/models/exam_attempt.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user.model');
const Exam = require('./exam.model');

const ExamAttempt = sequelize.define('ExamAttempt', {
    attempt_id: {
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
        },
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Exam,
            key: 'exam_id',
        },
    },
    start_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    end_time: {
        type: DataTypes.DATE,
    },
    score: {
        type: DataTypes.DECIMAL(5, 2), // Điểm số (tổng 5 chữ số, 2 chữ số thập phân)
    },
    total_questions:{
      type: DataTypes.INTEGER,
    },
    correct_answers: {
        type: DataTypes.INTEGER,
    },
    incorrect_answers: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'exam_attempts',
    timestamps: true, // Không cần timestamps cho bảng này.
});

ExamAttempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
ExamAttempt.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

module.exports = ExamAttempt;