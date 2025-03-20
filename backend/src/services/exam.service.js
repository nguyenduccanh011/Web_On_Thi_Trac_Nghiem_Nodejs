// src/services/exam.service.js
const Exam = require("../models/exam.model");
const ExamQuestion = require("../models/exam_question.model");
const Question = require("../models/question.model");
const ExamCategory = require("../models/exam_category.model");
const { Sequelize } = require("sequelize");

exports.getAllExams = async () => {
  try {
    const exams = await Exam.findAll({
      include: [
        { model: ExamCategory, as: "category" },
        { model: Question, as: "questions", through: { attributes: [] } }, // Lấy thông tin câu hỏi và loại bỏ các thuộc tính của bảng trung gian
      ],
    });
    return exams;
  } catch (error) {
    throw error;
  }
};

exports.getExamById = async (examId) => {
  try {
    const exam = await Exam.findByPk(examId, {
      include: [
        { model: ExamCategory, as: "category" },
        {
          model: Question,
          as: "questions",
          through: { attributes: ["question_order"] }, // Include question_order if needed
        },
      ],
    });

    if (!exam) {
      throw new Error("Exam not found");
    }
    return exam;
  } catch (error) {
    throw error;
  }
};

exports.createExam = async (examData) => {
  try {
    // 1. Tạo bản ghi Exam mới.
    const newExam = await Exam.create({
      exam_name: examData.exam_name,
      description: examData.description,
      category_id: examData.category_id,
    });

    // 2. Lấy danh sách ID câu hỏi từ examData.
    const questionIds = examData.questions; // Giả sử examData.questions là một mảng ID câu hỏi.

    // 3. Tạo các bản ghi ExamQuestion để liên kết đề thi với câu hỏi.
    if (questionIds && questionIds.length > 0) {
      const examQuestions = questionIds.map((questionId, index) => ({
        exam_id: newExam.exam_id,
        question_id: questionId,
        question_order: index + 1, // Ví dụ: thứ tự câu hỏi
      }));
      await ExamQuestion.bulkCreate(examQuestions);
    }

    // 4. Lấy thông tin đầy đủ của đề thi (bao gồm cả câu hỏi).  Không bắt buộc, tùy bạn.
    const examWithQuestions = await Exam.findByPk(newExam.exam_id, {
      include: [
        { model: ExamCategory, as: "category" },
        {
          model: Question,
          as: "questions",
          through: { attributes: ["question_order"] }, // Bao gồm cả thứ tự
        },
      ],
    });
    return examWithQuestions;
  } catch (error) {
    throw error; // Chuyển tiếp lỗi để controller xử lý.
  }
};

exports.updateExam = async (examId, examData) => {
  try {
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Cập nhật thông tin cơ bản của đề thi
    await exam.update({
      exam_name: examData.exam_name,
      description: examData.description,
      category_id: examData.category_id,
    });

    // Xử lý cập nhật câu hỏi (nếu có)
    if (examData.questions && Array.isArray(examData.questions)) {
      // Xóa các liên kết cũ
      await ExamQuestion.destroy({ where: { exam_id: examId } });

      // Tạo các liên kết mới
      const newExamQuestions = examData.questions.map((questionId, index) => ({
        exam_id: examId,
        question_id: questionId,
        question_order: index + 1,
      }));
      await ExamQuestion.bulkCreate(newExamQuestions);
    }

    // Lấy thông tin đề thi sau khi cập nhật (tùy chọn)
    const updatedExam = await Exam.findByPk(examId, {
      include: [
        { model: ExamCategory, as: "category" },
        {
          model: Question,
          as: "questions",
          through: { attributes: ["question_order"] },
        },
      ],
    });
    return updatedExam;
  } catch (error) {
    throw error;
  }
};

exports.deleteExam = async (examId) => {
  try {
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      throw new Error("Exam not found");
    }

    // Xóa các liên kết câu hỏi trước (quan trọng để tránh lỗi ràng buộc)
    await ExamQuestion.destroy({ where: { exam_id: examId } });

    // Xóa đề thi
    await exam.destroy();
    return { message: "Exam deleted successfully" }; // Trả về thông báo
  } catch (error) {
    throw error;
  }
};

// Hàm lấy danh sách câu hỏi theo category và difficulty, có giới hạn số lượng và random
exports.getQuestionsForExam = async (examId) => {
  try {
    const exam = await Exam.findById({ examId });

    const query = `
          (SELECT * FROM questions WHERE category_id = :categoryId AND difficulty = easy ORDER BY RAND() LIMIT :easyCount)
          UNION
          (SELECT * FROM questions WHERE category_id = :categoryId AND difficulty = medium ORDER BY RAND() LIMIT :mediumCount)
          UNION
          (SELECT * FROM questions WHERE category_id = :categoryId AND difficulty = hard ORDER BY RAND() LIMIT :hardCount)
        `;

    const questions = await sequelize.query(query, {
      replacements: {
        easy: DifficultyLevel.EASY, // Assume DifficultyLevel is imported
        medium: DifficultyLevel.MEDIUM,
        hard: DifficultyLevel.HARD,
        categoryId: exam.category_id,
        easyCount: exam.easy_question_count,
        mediumCount: exam.medium_question_count,
        hardCount: exam.hard_question_count,
      },
      type: Sequelize.QueryTypes.SELECT,
    });
    return questions;
  } catch (error) {
    throw error;
  }
};
