// src/services/exam_attempt.service.js
const ExamAttempt = require("../models/exam_attempt.model");
const UserAnswer = require("../models/user_answer.model");
const Exam = require("../models/exam.model");
const User = require("../models/user.model");
const Question = require("../models/question.model");
const { Sequelize } = require("sequelize");
const Answer = require("../models/answer.model");

// Lưu kết quả bài thi
exports.saveExamAttempt = async (userId, result) => {
  try {
    // Tạo một đối tượng mới từ kết quả bài thi
    const examAttempt = {
      user_id: userId,
      exam_id: result.exam_id,
      start_time: result.start_time,
      end_time: result.end_time,
      score: result.score,
      total_questions: result.total_questions,
      correct_answers: result.correct_answers,
      incorrect_answers: result.incorrect_answers,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Lưu vào cơ sở dữ liệu
    const savedAttempt = await ExamAttempt.create(examAttempt);
    return savedAttempt;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách bài thi của một user
exports.getAttemptsByUser = async (userId) => {
  try {
    const attempts = await ExamAttempt.findAll({
      where: { user_id: userId },
      include: [{ model: Exam, as: "exam", attributes: ["exam_name"] }],
    });
    return attempts;
  } catch (error) {
    throw error;
  }
};

//Lấy thông tin bài thi theo ID
exports.getAttemptById = async (attemptId) => {
  try {
    const attempt = await ExamAttempt.findByPk(attemptId, {
      include: [{ model: Exam, as: "exam" }],
    });
    if (!attempt) {
      throw new Error("Exam attempt not found");
    }
    return attempt;
  } catch (error) {
    throw error;
  }
};

// Create new exam attempt
exports.createExamAttempt = async (examAttempt) => {
  try {
    // Check if exam exists
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create new exam attempt with all attributes
    const examAttempt = await ExamAttempt.create({
      user_id: examAttempt.user_id,
      exam_id: examAttempt.exam_id,
      start_time: examAttempt.start_time,
      end_time: examAttempt.end_time,
      duration: examAttempt.duration,
      score: examAttempt.score,
      total_questions: examAttempt.total_questions,
      correct_answers: examAttempt.correct_answers,
      wrong_answers: examAttempt.wrong_answers,
      created_at: examAttempt.created_at,
      updated_at: examAttempt.updated_at,
    });

    return examAttempt;
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
        {
          model: UserAnswer,
          as: "user_answers",
          include: [
            {
              model: Question,
              as: "question",
              attributes: {
                exclude: ["correct_answer", "category_id"], // loại bỏ trường này
              },
              include: [
                {
                  model: Answer,
                  as: "answers",
                  attributes: ["answer_id", "answer_text"],
                },
              ],
            },
          ],
        },
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
