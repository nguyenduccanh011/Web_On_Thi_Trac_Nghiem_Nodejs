// src/models/question.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const ExamCategory = require('./exam_category.model'); // Import model ExamCategory

const Question = sequelize.define('Question', {
  question_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  correct_answer: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ExamCategory, // Thay đổi thành ExamCategory
      key: 'category_id',
    },
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
  },
  explanation: {
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
  tableName: 'questions',
  timestamps: true,
   updatedAt: 'updated_at', // Đặt tên tùy chỉnh cho trường updatedAt
   createdAt: 'created_at', // Đặt tên tùy chỉnh cho trường createdAt

});

// Thiết lập mối quan hệ với ExamCategory
Question.belongsTo(ExamCategory, { foreignKey: 'category_id', as: 'category' });

module.exports = Question;