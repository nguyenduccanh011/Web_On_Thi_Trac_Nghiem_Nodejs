// src/models/user_answer.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const ExamAttempt = require('./exam_attempt.model');
const Question = require('./question.model');

const UserAnswer = sequelize.define('UserAnswer', {
    user_answer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    attempt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ExamAttempt,
            key: 'attempt_id',
        },
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Question,
            key: 'question_id',
        },
    },
    selected_answer: {
        type: DataTypes.STRING(255),
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
    },
}, {
    tableName: 'user_answers',
    timestamps: false,
});

UserAnswer.belongsTo(ExamAttempt, { foreignKey: 'attempt_id', as: 'attempt' });
UserAnswer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

module.exports = UserAnswer;