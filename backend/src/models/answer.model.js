const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Question = require("./question.model"); // Import model Question

const Answer = sequelize.define(
  "Answer",
  {
    answer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    answer_text: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Question,
        key: "question_id",
      },
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "answers",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

// Thiết lập mối quan hệ với Question
// Answer.belongsTo(Question, { foreignKey: "question_id", as: "question" });

module.exports = Answer;
