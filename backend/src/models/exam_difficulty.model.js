// src/models/exam_difficulty.model.js (Tên file đề xuất)
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Exam = require("./exam.model"); // Import model Exam (mới)
const DifficultyLevel = require("./difficulty_level.model"); // Import model DifficultyLevel (diffModel)

const ExamDifficulty = sequelize.define(
  "ExamDifficulty",
  {
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Đánh dấu là phần của khóa chính
      references: {
        model: Exam, // Tham chiếu đến model Exam (mới)
        key: "exam_id",
      },
      // Đã bỏ onDelete và onUpdate
    },
    difficult_level_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Đánh dấu là phần của khóa chính
      references: {
        model: DifficultyLevel, // Tham chiếu đến model DifficultyLevel
        key: "difficult_level_id",
      },
      // Đã bỏ onDelete và onUpdate
    },
    // Thêm trường question_count
    question_count: {
      type: DataTypes.INTEGER,
      allowNull: false, // Đảm bảo luôn có số lượng câu hỏi
      defaultValue: 0, // Giá trị mặc định là 0
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
    tableName: "exam_difficulties", // Tên bảng nối đề xuất
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
    // Đã bỏ phần indexes comment
  }
);

module.exports = ExamDifficulty;

// --- ĐỊNH NGHĨA QUAN HỆ NHIỀU-NHIỀU ---
// Giữ nguyên như trước, đảm bảo chúng được gọi sau khi các model đã được định nghĩa

// Exam có thể có nhiều DifficultyLevels thông qua bảng ExamDifficulty
Exam.belongsToMany(DifficultyLevel, {
  through: ExamDifficulty,
  foreignKey: "exam_id", // Khóa trong bảng ExamDifficulty trỏ về Exam
  otherKey: "difficult_level_id", // Khóa trong bảng ExamDifficulty trỏ về DifficultyLevel
  as: "difficultyLevels", // Bí danh cho quan hệ
});

// DifficultyLevel có thể thuộc về nhiều Exams thông qua bảng ExamDifficulty
DifficultyLevel.belongsToMany(Exam, {
  through: ExamDifficulty,
  foreignKey: "difficult_level_id", // Khóa trong bảng ExamDifficulty trỏ về DifficultyLevel
  otherKey: "exam_id", // Khóa trong bảng ExamDifficulty trỏ về Exam
  as: "exams", // Bí danh cho quan hệ
});
