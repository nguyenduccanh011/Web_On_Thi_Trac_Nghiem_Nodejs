// src/models/exam_question.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Exam = require('./exam.model');
const Question = require('./question.model');

const ExamQuestion = sequelize.define('ExamQuestion', {
    exam_question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Exam, // Tham chiếu trực tiếp đến model Exam
            key: 'exam_id',
        },
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Question, // Tham chiếu trực tiếp đến model Question
            key: 'question_id',
        },
    },
    question_order: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'exam_questions',
    timestamps: false, // Không cần timestamps cho bảng trung gian
});

// Quan hệ nhiều-nhiều
Exam.belongsToMany(Question, { through: ExamQuestion, foreignKey: 'exam_id', otherKey: 'question_id', as: 'questions' });
Question.belongsToMany(Exam, { through: ExamQuestion, foreignKey: 'question_id', otherKey: 'exam_id', as: 'exams' });

module.exports = ExamQuestion;