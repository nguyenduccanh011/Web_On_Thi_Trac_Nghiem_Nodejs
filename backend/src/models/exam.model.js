// src/models/exam.model.js (Hoặc tên file mới nếu bạn muốn)
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const ExamCategory = require("./exam_category.model"); // Giả sử bạn có model này

const Exam = sequelize.define(
  "Exam",
  {
    exam_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    exam_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // Đã loại bỏ: easy_question_count, medium_question_count, hard_question_count
    description: {
      type: DataTypes.TEXT,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ExamCategory, // Tham chiếu đến model ExamCategory
        key: "category_id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "exams",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

// Định nghĩa quan hệ 1-N với ExamCategory
Exam.belongsTo(ExamCategory, { foreignKey: "category_id", as: "category" });

// Quan hệ N-N với DifficultyLevel sẽ được định nghĩa ở phần dưới
// hoặc sau khi cả hai model Exam và DifficultyLevel đã được định nghĩa.

module.exports = Exam;
