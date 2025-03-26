// src/services/exam_attempt.service.js
const ExamAttempt = require("../models/exam_attempt.model");
const UserAnswer = require("../models/user_answer.model");
const Exam = require("../models/exam.model");
const User = require("../models/user.model");
const Question = require("../models/question.model");
const { Sequelize } = require("sequelize");

// Lấy danh sách bài thi của một user
exports.getAttemptsByUser = async (userId) => {
  try {
    const attempts = await ExamAttempt.findAll({
      where: { userId },
      include: [{ model: Exam, as: "exam" }],
    });
    return attempts;
  } catch (error) {
    throw error;
  }
};

// Lấy thông tin chi tiết của một bài thi
exports.getAttemptDetails = async (attemptId) => {
  try {
    const attempt = await ExamAttempt.findByPk(attemptId, {
      include: [
        { model: Exam, as: "exam" },
        { model: User, as: "user", attributes: { exclude: ["password"] } },
      ],
    });
    if (!attempt) {
      throw new Error("Exam attempt not found");
    }
    return attempt;
  } catch (error) {
    throw error;
  }
};
